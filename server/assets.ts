import { Router, static as serveStatic } from "express";
import { existsSync } from "fs";
import { resolve } from "path";
import { Emoji, User } from "../models";

const ASSETS_PATH = resolve(__dirname, "..", "assets");
export const router = Router();

if (existsSync(ASSETS_PATH)) {
    router.use(serveStatic(ASSETS_PATH));
}

router
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
