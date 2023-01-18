import e, { json, urlencoded } from "express";
import { router as apiRouter } from "./api";
import { router as clientRouter } from "./client";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const app = e()
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(apiRouter)
    .use(clientRouter);

app.listen(PORT, () => {
    console.log(`[server] Listening on port ${PORT}`);
});
