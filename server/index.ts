try {
    require("dotenv").config();
}
catch {
    console.warn("Not using dotenv. Ensure environment variables are set");
}

import { sequelize } from "../models";
import { listen } from "./app";
import { DB_FORCE } from "./constants";
import { proxy, proxyReady } from "./proxy";

(async function main() {
    await sequelize.sync({ force: DB_FORCE });
    await listen();
    if (proxyReady()) {
        await proxy();
    }
})();
