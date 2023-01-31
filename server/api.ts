import { Router } from "express";
import {
    Attachment,
    Channel,
    Message,
    sequelize,
    User
} from "../models";
import { PAGE_LIMIT } from "./constants";

const BASE_AVATAR_URL = "https://cdn.discordapp.com/";
export const router = Router();

router
    .get("/api/channels", async (_, res) => {
        const channels = await channelList();
        res
            .status(200)
            .json(channels);
    })
    .get("/api/channel/:channelId/:page", async (req, res) => {
        const pageNumber = parseInt(req.params.page);
        if (isNaN(pageNumber) || pageNumber.toString() !== req.params.page) {
            res
                .status(400)
                .end();
            return;
        }
        const page = await getChannelPage(req.params.channelId, pageNumber - 1);
        if (!page) {
            res
                .status(404)
                .end();
            return;
        }
        res
            .status(200)
            .json(page);
    });

async function channelList(): Promise<Array<ChannelData>> {
    const models = <Array<CountedChannel>>await Channel.findAll({
        attributes: [
            "id",
            "name",
            [sequelize.literal("(SELECT COUNT(*) FROM `Messages` as `Message` WHERE `Message`.`ChannelId` = `Channel`.`id`)"), "MessageCount"]
        ]
    });
    return models.map(model => ({
        id: model.id,
        name: model.name,
        pages: Math.ceil(model.getDataValue("MessageCount") / PAGE_LIMIT)
    }));
}

function avatarUrl(id: string, discriminator: string, hash?: string): string {
    return BASE_AVATAR_URL + (hash ? `avatars/${id}/${hash}.png` : `embed/avatars/${parseInt(discriminator) % 5}.png`);
}

async function getChannelPage(channelId: string, pageIndex: number): Promise<MessagesData | null> {
    const messages = await Message.findAll({
        where: { ChannelId: channelId },
        attributes: ["id", "content", "createdAt", "UserId"],
        order: [["createdAt", "ASC"]],
        limit: PAGE_LIMIT,
        offset: pageIndex * PAGE_LIMIT,
        include: [
            {
                model: User,
                attributes: ["id", "username", "discriminator", "avatar"]
            },
            {
                model: Attachment,
                attributes: ["filename"]
            }
        ]
    });
    if (!messages.length) {
        return null;
    }
    const [messageData, userCollection] = messages.reduce((data: [Array<MessageData>, Map<string, UserData>], message) => {
        if (!data[1].has(message.User!.id)) {
            data[1].set(message.User!.id, {
                id: message.User!.id,
                username: message.User!.username,
                discriminator: message.User!.discriminator,
                avatarUrl: avatarUrl(message.User!.id, message.User!.discriminator, message.User!.avatar)
            });
        }
        data[0].push({
            id: message.id,
            authorId: message.UserId,
            content: message.content,
            createdAt: message.createdAt.getTime(),
            break: message.break,
            attachments: message.Attachments!.map(attachment => attachment.filename)
        });
        return data;
    }, [new Array<MessageData>(), new Map<string, UserData>()]);
    return {
        messages: messageData,
        users: Array.from(userCollection.values())
    };
}

interface CountedMessages {
    getDataValue(key: "MessageCount"): number;
}

type CountedChannel = Channel & CountedMessages;

type ChannelData = {
    id: string,
    name: string,
    pages: number
};

type MessageData = {
    id: string,
    authorId: string,
    content: string,
    createdAt: number,
    break: boolean,
    attachments: Array<string>
};

type UserData = {
    id: string,
    username: string,
    discriminator: string,
    avatarUrl: string
};

type MessagesData = {
    messages: Array<MessageData>,
    users: Array<UserData>
};
