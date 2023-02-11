import { Router, static as serveStatic } from "express";
import { existsSync } from "fs";
import { resolve } from "path";

const CLIENT_PATH = resolve(__dirname, "..", "client", "dist");
export const router = Router();

if (existsSync(CLIENT_PATH)) {
    router
        .use(serveStatic(CLIENT_PATH))
        .get("*", (_, res) =>
            res
                .status(308)
                .redirect("/")
        );
}
