"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockUsersRepository = void 0;
const argon2_1 = require("@node-rs/argon2");
const common_1 = require("@nestjs/common");
let MockUsersRepository = class MockUsersRepository {
    _users;
    constructor() {
        const hashOptions = {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1,
        };
        this._users = [
            {
                id: "1",
                first_name: "John",
                last_name: "Doe",
                email: "john.doe@example.com",
                password_hash: (0, argon2_1.hashSync)("password123", hashOptions),
            },
            {
                id: "2",
                first_name: "Jane",
                last_name: "Smith",
                email: "jane.smith@example.com",
                password_hash: (0, argon2_1.hashSync)("password456", hashOptions),
            },
        ];
    }
    async getUser(id) {
        return this._users.find((u) => u.id === id);
    }
    async getUserByEmail(email) {
        return this._users.find((u) => u.email === email);
    }
    async createUser(input) {
        const newUser = {
            ...input,
        };
        this._users.push(newUser);
        return newUser;
    }
};
exports.MockUsersRepository = MockUsersRepository;
exports.MockUsersRepository = MockUsersRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MockUsersRepository);
//# sourceMappingURL=users.repository.mock.js.map