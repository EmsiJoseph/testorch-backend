"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.luciaAdapter = exports.db = void 0;
const vercel_postgres_1 = require("drizzle-orm/vercel-postgres");
const postgres_1 = require("@vercel/postgres");
const adapter_drizzle_1 = require("@lucia-auth/adapter-drizzle");
const schema = require("./schema");
const postgresUrl = process.env.POSTGRES_URL;
if (!postgresUrl) {
    throw new Error("Missing POSTGRES_URL environment variable");
}
const client = (0, postgres_1.createPool)({
    connectionString: postgresUrl,
});
exports.db = (0, vercel_postgres_1.drizzle)(client, { schema });
exports.luciaAdapter = new adapter_drizzle_1.DrizzlePostgreSQLAdapter(exports.db, schema.sessions, schema.users);
//# sourceMappingURL=index.js.map