import e, { json, urlencoded } from "express";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const app = e()
    .use(urlencoded({ extended: true }))
    .use(json());

app.listen(PORT, () => {
    console.log(`[server] Listening on port ${PORT}`);
});
