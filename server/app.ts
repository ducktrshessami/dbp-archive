import e, { json, urlencoded } from "express";
import { router as apiRouter } from "./api";
import { router as attachmentRouter } from "./attachment";
import { router as clientRouter } from "./client";
import { PORT } from "./constants";

const app = e()
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(apiRouter)
    .use(attachmentRouter)
    .use(clientRouter);

export async function listen(): Promise<void> {
    await new Promise<void>(resolve => app.listen(PORT, resolve));
    console.log(`[server] Listening on port ${PORT}`);
}
