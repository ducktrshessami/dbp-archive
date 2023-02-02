import { Router } from "express";
import { existsSync } from "fs";
import { join, resolve } from "path";

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
    });
