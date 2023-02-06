import { Router } from "express";
import { existsSync } from "fs";
import { join, resolve } from "path";
import { Emoji, User } from "../models";

const ASSETS_PATH = resolve(__dirname, "..", "assets");
const ATTACHMENTS_PATH = join(ASSETS_PATH, "attachments");
const AVATARS_PATH = join(ASSETS_PATH, "avatars");
const EMOJIS_PATH = join(ASSETS_PATH, "emojis");
export const router = Router();

router
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
    })
    .get("/avatar/:filename", (req, res) => {
        const filepath = join(AVATARS_PATH, req.params.filename);
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
    })
    .get("/emoji/:filename", (req, res) => {
        const filepath = join(EMOJIS_PATH, req.params.filename);
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
    })
    .get("/users.css", async (_, res) => {
        const users = await User.findAll({
            attributes: ["id", "displayColor"]
        });
        const style = users
            .map(user => `.author[meta-author-id="${user.id}"]{color:${hex(user.displayColor)};}`)
            .join("");
        res
            .status(200)
            .contentType("text/css")
            .send(style);
    })
    .get("/emojis.css", async (_, res) => {
        const emojis = await Emoji.findAll({
            attributes: ["id", "filename"]
        });
        const style = emojis
            .map(emoji => `.emoji[meta-emoji-id="${emoji.id}"]{content:url("/emoji/${emoji.filename}");}`)
            .join("");
        res
            .status(200)
            .contentType("text/css")
            .send(style);
    });

function hex(n: number): string {
    const raw = n.toString(16);
    const zeroes = new Array<number>(6 - raw.length)
        .fill(0)
        .join("");
    return `#${zeroes}${raw}`;
}
