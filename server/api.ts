import { Router } from "express";
import { Op } from "sequelize";
import {
    Attachment,
    Channel,
    Message,
    Role,
    sequelize,
    User
} from "../models";
import { PAGE_LIMIT } from "./constants";

export const router = Router();

router
    .get("/api/resolved/channels", async (_, res) => {
        const channels = await channelList();
        res
            .status(200)
            .json(channels);
    })
    .get("/api/resolved/users", async (_, res) => {
        const users = await userList();
        res
            .status(200)
            .json(users);
    })
    .get("/api/resolved/roles", async (_, res) => {
        const roles = await roleList();
        res
            .status(200)
            .json(roles);
    })
    .get("/api/resolved/message-links", async (_, res) => {
        const messageLinks = await resolveMessageLinks();
        res
            .status(200)
            .json(messageLinks);
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

async function userList(): Promise<Array<UserData>> {
    const models = await User.findAll({
        attributes: ["id", "username", "discriminator", "avatarFilename"]
    });
    return models.map(model => ({
        id: model.id,
        username: model.username,
        discriminator: model.discriminator,
        avatarUrl: avatarUrl(model)
    }));
}

async function channelList(): Promise<Array<ChannelData>> {
    const models = <Array<CountedChannel>>await Channel.findAll({
        attributes: [
            "id",
            "name",
            "hidden",
            [sequelize.literal("(SELECT COUNT(*) FROM `Messages` as `Message` WHERE `Message`.`ChannelId` = `Channel`.`id`)"), "MessageCount"]
        ],
        order: [["order", "ASC"]]
    });
    return models.map(model => ({
        id: model.id,
        name: model.name,
        hidden: model.hidden,
        pages: Math.ceil(model.getDataValue("MessageCount") / PAGE_LIMIT)
    }));
}

async function roleList(): Promise<Array<RoleData>> {
    const models = await Role.findAll({
        attributes: ["id", "name"]
    });
    return models.map(model => ({
        id: model.id,
        name: model.name
    }));
}

function defaultAvatarUrl(discriminator: string): string {
    return `https://cdn.discordapp.com/embed/avatars/${parseInt(discriminator) % 5}.png`;
}

function avatarUrl(user: User): string {
    return user.avatarFilename ? `/avatar/${user.avatarFilename}` : defaultAvatarUrl(user.discriminator);
}

async function getChannelPage(channelId: string, pageIndex: number): Promise<Array<MessageData> | null> {
    const messages = await Message.findAll({
        where: { ChannelId: channelId },
        attributes: ["id", "content", "createdAt", "UserId"],
        order: [["createdAt", "ASC"]],
        limit: PAGE_LIMIT,
        offset: pageIndex * PAGE_LIMIT,
        include: {
            model: Attachment,
            attributes: ["filename"]
        }
    });
    if (!messages.length) {
        return null;
    }
    return messages.map(message => ({
        id: message.id,
        authorId: message.UserId,
        content: message.content,
        createdAt: message.createdAt.getTime(),
        break: message.break,
        attachments: message.Attachments!.map(attachment => attachment.filename)
    }));
}

async function getMessagePageNum(channelId: string, messageId: string): Promise<number | null> {
    const message = await Message.findByPk(messageId, {
        attributes: ["createdAt"],
        include: {
            model: Channel,
            attributes: ["hidden"]
        }
    });
    if (!message || message.Channel!.hidden) {
        return null;
    }
    const before = await Message.count({
        where: {
            ChannelId: channelId,
            createdAt: {
                [Op.lt]: message.createdAt
            }
        }
    });
    return Math.floor(before / PAGE_LIMIT) + 1;
}

async function resolveMessageLinks(): Promise<Array<MessageLinkData>> {
    const messages = await Message.findAll({
        attributes: ["content"]
    });
    const resolved = new Map<string, number>();
    for (const message of messages) {
        const linkResults = message.content.matchAll(/https?:\/\/discord(app)?.com\/channels\/(?<guildId>\d{17,19})\/(?<channelId>\d{17,19})\/(?<messageId>\d{17,19})\/?/gi);
        for (const result of linkResults) {
            const ids = `${result.groups!.channelId}/${result.groups!.messageId}`;
            if (!resolved.has(ids)) {
                const page = await getMessagePageNum(result.groups!.channelId, result.groups!.messageId);
                if (page) {
                    resolved.set(ids, page);
                }
            }
        }
    }
    return Array.from(resolved.entries());
}

interface CountedMessages {
    getDataValue(key: "MessageCount"): number;
}

type CountedChannel = Channel & CountedMessages;

type ChannelData = {
    id: string,
    name: string,
    hidden: boolean,
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

type RoleData = {
    id: string,
    name: string
};

type MessageLinkData = [string, number];

type ResolvedData = {
    channels: Array<ChannelData>,
    users: Array<UserData>,
    roles: Array<RoleData>,
    messageLinks: Array<MessageLinkData>
};
