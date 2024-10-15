"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepository = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const common_1 = require("@nestjs/common");
const common_2 = require("../../../domain/errors/common");
const database_1 = require("../../database");
const schema_1 = require("../../database/schema");
let UsersRepository = class UsersRepository {
    async getUser(id) {
        const query = database_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.users.id, id),
        });
        return await query.execute();
    }
    async getUserByEmail(email) {
        const query = database_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.users.email, email),
        });
        return await query.execute();
    }
    async createUser(input) {
        const query = database_1.db.insert(schema_1.users).values(input).returning();
        const [created] = await query.execute();
        if (created) {
            return created;
        }
        else {
            throw new common_2.DatabaseOperationError("Cannot create user.");
        }
    }
};
exports.UsersRepository = UsersRepository;
exports.UsersRepository = UsersRepository = __decorate([
    (0, common_1.Injectable)()
], UsersRepository);
//# sourceMappingURL=users.repository.js.map