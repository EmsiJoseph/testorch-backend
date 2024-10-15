"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInUseCase = void 0;
const argon2_1 = require("@node-rs/argon2");
const auth_1 = require("../../../domain/errors/auth");
async function signInUseCase(input, usersRepository, authService) {
    const existingUser = await usersRepository.getUserByEmail(input.email);
    if (!existingUser) {
        throw new auth_1.AuthenticationError("User does not exist");
    }
    const validPassword = await (0, argon2_1.verify)(existingUser.password_hash, input.password_hash, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
    });
    if (!validPassword) {
        throw new auth_1.AuthenticationError("Incorrect email or password");
    }
    return await authService.createSession(existingUser);
}
exports.signInUseCase = signInUseCase;
//# sourceMappingURL=sign-in.use-case.js.map