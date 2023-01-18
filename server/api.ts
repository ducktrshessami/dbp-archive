import { Router } from "express";
import { existsSync } from "fs";
import { join, resolve } from "path";
import { Channel } from "../models";

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
    const models = await Channel.findAll({ attributes: ["id", "name"] });
    return models.map(model => ({
        id: model.id,
        name: model.name
    }));
}

type ChannelData = {
    id: string,
    name: string
};
