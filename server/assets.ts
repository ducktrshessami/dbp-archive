import { Router } from "express";
import { existsSync } from "fs";
import { join, resolve } from "path";
import { User } from "../models";

const ASSETS_PATH = resolve(__dirname, "..", "assets");
const ATTACHMENTS_PATH = join(ASSETS_PATH, "attachments");
const AVATARS_PATH = join(ASSETS_PATH, "avatars");
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
    });

function hex(n: number): string {
    const raw = n.toString(16);
    const zeroes = new Array<number>(6 - raw.length)
        .fill(0)
        .join("");
    return `#${zeroes}${raw}`;
}
