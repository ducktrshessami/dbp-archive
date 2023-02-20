import { Router, static as serveStatic } from "express";
import { existsSync } from "fs";
import { join, resolve } from "path";

const CLIENT_PATH = resolve(__dirname, "..", "client", "dist");
const CLIENT_INDEX = join(CLIENT_PATH, "index.html");
export const router = Router();

if (existsSync(CLIENT_PATH)) {
    router
        .use(serveStatic(CLIENT_PATH))
        .get("*", (_, res) =>
            res
                .status(200)
                .sendFile(CLIENT_INDEX)
        );
}
