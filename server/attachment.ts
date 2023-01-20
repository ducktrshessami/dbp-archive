import { Router } from "express";
import { existsSync } from "fs";
import { join, resolve } from "path";

const ATTACHMENTS_PATH = resolve(__dirname, "..", "attachments");
export const router = Router();

router.get("/attachment/:filename", (req, res) => {
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
