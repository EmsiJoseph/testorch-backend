"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const lucia_1 = require("lucia");
const database_1 = require("../../database");
const auth_constant_1 = require("../../../../constants/auth.constant");
const session_1 = require("../../../domain/models/session");
const auth_1 = require("../../../domain/errors/auth");
class AuthenticationService {
    _usersRepository;
    _lucia;
    constructor(_usersRepository) {
        this._usersRepository = _usersRepository;
        this._lucia = new lucia_1.Lucia(database_1.luciaAdapter, {
            sessionCookie: {
                name: auth_constant_1.SESSION_COOKIE,
                expires: false,
                attributes: {
                    secure: process.env.NODE_ENV === "production",
                },
            },
            getUserAttributes: (attributes) => {
                return {
                    email: attributes.email,
                };
            },
        });
    }
    async validateSession(sessionId) {
        const result = await this._lucia.validateSession(sessionId);
        if (!result.user || !result.session) {
            throw new auth_1.UnauthenticatedError("Unauthenticated");
        }
        const user = await this._usersRepository.getUser(result.user.id);
        if (!user) {
            throw new auth_1.UnauthenticatedError("User doesn't exist");
        }
        return { user, session: result.session };
    }
    async createSession(user) {
        const luciaSession = await this._lucia.createSession(user.id, {});
        const session = session_1.sessionSchema.parse(luciaSession);
        const cookie = this._lucia.createSessionCookie(session.id);
        return { session, cookie };
    }
    async invalidateSession(sessionId) {
        await this._lucia.invalidateSession(sessionId);
        const blankCookie = this._lucia.createBlankSessionCookie();
        return { blankCookie };
    }
    generateUserId() {
        return (0, lucia_1.generateIdFromEntropySize)(10);
    }
}
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=authentication.service.js.map