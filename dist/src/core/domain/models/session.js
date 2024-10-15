"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionSchema = void 0;
const drizzle_zod_1 = require("drizzle-zod");
const schema_1 = require("../../infrastructure/database/schema");
exports.sessionSchema = (0, drizzle_zod_1.createSelectSchema)(schema_1.sessions);
//# sourceMappingURL=session.js.map