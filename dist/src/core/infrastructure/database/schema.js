"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testPlans = exports.projects = exports.teamMembers = exports.teams = exports.sessions = exports.users = exports.teamRoleEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.teamRoleEnum = (0, pg_core_1.pgEnum)("role", ["admin", "member", "observer"]);
exports.users = (0, pg_core_1.pgTable)("user", {
    id: (0, pg_core_1.text)("id").primaryKey().notNull(),
    first_name: (0, pg_core_1.varchar)("first_name", { length: 255 }).notNull(),
    last_name: (0, pg_core_1.varchar)("last_name", { length: 255 }).notNull(),
    email: (0, pg_core_1.varchar)("email").notNull(),
    password_hash: (0, pg_core_1.varchar)("password_hash", { length: 255 }).notNull(),
}, (users) => {
    return {
        uniqueIdx: (0, pg_core_1.uniqueIndex)("unique_idx").on(users.email),
    };
});
exports.sessions = (0, pg_core_1.pgTable)("session", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    userId: (0, pg_core_1.text)("user_id")
        .notNull()
        .references(() => exports.users.id),
    expiresAt: (0, pg_core_1.timestamp)("expires_at").notNull(),
});
exports.teams = (0, pg_core_1.pgTable)("team", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    name: (0, pg_core_1.varchar)("name").notNull(),
    description: (0, pg_core_1.varchar)("description"),
    org_id: (0, pg_core_1.uuid)("org_id"),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow().$onUpdateFn(() => new Date()),
});
exports.teamMembers = (0, pg_core_1.pgTable)("team_members", {
    user_id: (0, pg_core_1.text)("user_id")
        .notNull()
        .references(() => exports.users.id),
    team_id: (0, pg_core_1.uuid)("team_id")
        .notNull()
        .references(() => exports.teams.id),
    role: (0, exports.teamRoleEnum)("role").notNull(),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    update_at: (0, pg_core_1.timestamp)("updated_at").defaultNow().$onUpdateFn(() => new Date()),
});
exports.projects = (0, pg_core_1.pgTable)("project", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    name: (0, pg_core_1.varchar)("name").notNull(),
    description: (0, pg_core_1.varchar)("description"),
    team_id: (0, pg_core_1.uuid)("team_id")
        .references(() => exports.teams.id),
    created_by: (0, pg_core_1.text)("created_by")
        .references(() => exports.users.id),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow().$onUpdateFn(() => new Date()),
});
exports.testPlans = (0, pg_core_1.pgTable)("test_plan", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    name: (0, pg_core_1.varchar)("name").notNull(),
    description: (0, pg_core_1.varchar)("description"),
    git_link: (0, pg_core_1.varchar)("git_link").notNull(),
    project_id: (0, pg_core_1.uuid)("project_id")
        .references(() => exports.projects.id),
    created_by: (0, pg_core_1.text)("created_by")
        .references(() => exports.users.id),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow().$onUpdateFn(() => new Date()),
});
//# sourceMappingURL=schema.js.map