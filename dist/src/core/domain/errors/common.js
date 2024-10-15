"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputParseError = exports.NotFoundError = exports.DatabaseOperationError = void 0;
class DatabaseOperationError extends Error {
    constructor(message, options) {
        super(message, options);
    }
}
exports.DatabaseOperationError = DatabaseOperationError;
class NotFoundError extends Error {
    constructor(message, options) {
        super(message, options);
    }
}
exports.NotFoundError = NotFoundError;
class InputParseError extends Error {
    constructor(message, options) {
        super(message, options);
    }
}
exports.InputParseError = InputParseError;
//# sourceMappingURL=common.js.map