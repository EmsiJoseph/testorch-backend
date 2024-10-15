"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpUseCase = void 0;
const argon2_1 = require("@node-rs/argon2");
const auth_1 = require("../../../domain/errors/auth");
async function signUpUseCase(input, usersRepository, authService) {
    const user = await usersRepository.getUserByEmail(input.email);
    if (user) {
        throw new auth_1.AuthenticationError("Email is already taken");
    }
    const passwordHash = await (0, argon2_1.hash)(input.password_hash, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
    });
    const userId = authService.generateUserId();
    if (!userId) {
        throw new Error("Failed to generate user ID");
    }
    const newUser = {
        id: userId,
        first_name: input.first_name,
        last_name: input.last_name,
        email: input.email,
        password_hash: passwordHash,
    };
    const createdUser = await usersRepository.createUser(newUser);
    const { cookie, session } = await authService.createSession(createdUser);
    return {
        session,
        cookie,
        user: {
            id: createdUser.id,
            first_name: createdUser.first_name,
            last_name: createdUser.last_name,
            email: createdUser.email,
        },
    };
}
exports.signUpUseCase = signUpUseCase;
//# sourceMappingURL=sign-up.use-case.js.map