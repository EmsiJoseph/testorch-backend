"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = exports.UnauthenticatedError = exports.AuthenticationError = void 0;
class AuthenticationError extends Error {
    constructor(message, options) {
        super(message, options);
    }
}
exports.AuthenticationError = AuthenticationError;
class UnauthenticatedError extends Error {
    constructor(message, options) {
        super(message, options);
    }
}
exports.UnauthenticatedError = UnauthenticatedError;
class UnauthorizedError extends Error {
    constructor(message, options) {
        super(message, options);
    }
}
exports.UnauthorizedError = UnauthorizedError;
//# sourceMappingURL=auth.js.map