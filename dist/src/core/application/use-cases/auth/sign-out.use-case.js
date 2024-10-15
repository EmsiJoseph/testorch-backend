"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signOutUseCase = void 0;
async function signOutUseCase(sessionId, authService) {
    return await authService.invalidateSession(sessionId);
}
exports.signOutUseCase = signOutUseCase;
//# sourceMappingURL=sign-out.use-case.js.map