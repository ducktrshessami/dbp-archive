export const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

export const PAGE_LIMIT = process.env.PAGE_LIMIT ? parseInt(process.env.PAGE_LIMIT) : 1000;

export const DB_FORCE = process.env.DB_FORCE ? process.env.DB_FORCE.toLowerCase() !== "false" : false;

export const CF_KEY = process.env.CF_KEY || "DBP_ARCHIVE";
