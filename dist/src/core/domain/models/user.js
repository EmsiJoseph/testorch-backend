"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpSchema = exports.signInSchema = exports.newUserSchema = exports.userSchema = void 0;
const zod_1 = require("zod");
const drizzle_zod_1 = require("drizzle-zod");
const schema_1 = require("../../infrastructure/database/schema");
exports.userSchema = (0, drizzle_zod_1.createSelectSchema)(schema_1.users);
exports.newUserSchema = (0, drizzle_zod_1.createInsertSchema)(schema_1.users, {
    email: (schema) => schema.email.email(),
    password_hash: (schema) => schema.password_hash.min(8),
}).required({
    first_name: true,
    last_name: true,
    email: true,
    password_hash: true,
});
exports.signInSchema = (0, drizzle_zod_1.createInsertSchema)(schema_1.users, {
    email: (schema) => schema.email.email(),
    password_hash: (schema) => schema.password_hash.min(8).max(31),
}).omit({
    id: true,
    first_name: true,
    last_name: true,
});
exports.signUpSchema = zod_1.z
    .object({
    first_name: zod_1.z.string().min(3).max(31),
    last_name: zod_1.z.string().min(3).max(31),
    email: zod_1.z.string().min(3).max(31),
    password_hash: zod_1.z.string().min(6).max(31),
    confirm_password: zod_1.z.string().min(6).max(31),
})
    .superRefine(({ password_hash, confirm_password }, ctx) => {
    if (confirm_password !== password_hash) {
        ctx.addIssue({
            code: "custom",
            message: "The passwords did not match",
            path: ["password"],
        });
        ctx.addIssue({
            code: "custom",
            message: "The passwords did not match",
            path: ["confirmPassword"],
        });
    }
});
//# sourceMappingURL=user.js.map