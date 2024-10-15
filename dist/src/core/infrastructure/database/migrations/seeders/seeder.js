"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const url_1 = require("url");
const seedersPath = path_1.default.join(__dirname, "./");
async function runAllSeeders() {
    const files = fs_1.default.readdirSync(seedersPath);
    for (const file of files) {
        if (file.endsWith(".seeder.ts")) {
            const filePath = path_1.default.join(seedersPath, file);
            const fileUrl = (0, url_1.pathToFileURL)(filePath);
            try {
                const seeder = await Promise.resolve(`${fileUrl.href}`).then(s => require(s));
                if (typeof seeder.default === "function") {
                    console.log(`Running seeder: ${file}`);
                    await seeder.default();
                }
            }
            catch (err) {
                console.error(`Failed to run seeder: ${file}`, err);
            }
        }
    }
    console.log("All seeders have been run.");
}
runAllSeeders().catch((err) => {
    console.error("Error running seeders:", err);
});
//# sourceMappingURL=seeder.js.map