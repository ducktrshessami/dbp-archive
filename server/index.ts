try {
    require("dotenv").config();
}
catch {
    console.warn("Not using dotenv. Ensure environment variables are set");
}

import { listen } from "./app";

(async function main() {
    await listen();
})();
