import { Router } from "express";
import { existsSync } from "fs";
import { join, resolve } from "path";
import { Channel, sequelize } from "../models";
import { PAGE_LIMIT } from "./constants";

const ATTACHMENTS_PATH = resolve(__dirname, "..", "attachments");
export const router = Router();

router
    .get("/channels", async (_, res) => {
        const channels = await channelList();
        res
            .status(200)
            .json(channels);
    })
    .get("/attachment/:filename", (req, res) => {
        const filepath = join(ATTACHMENTS_PATH, req.params.filename);
        if (existsSync(filepath)) {
            res
                .status(200)
                .sendFile(filepath);
        }
        else {
            res
                .status(404)
                .end();
        }
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

interface CountedMessages {
    getDataValue(key: "MessageCount"): number;
}

type CountedChannel = Channel & CountedMessages;

type ChannelData = {
    id: string,
    name: string,
    pages: number
};
