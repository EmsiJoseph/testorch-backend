"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.generateStrongPassword = void 0;
const crypto = require("crypto");
const generateStrongPassword = () => {
    return crypto.randomBytes(12).toString("hex");
};
exports.generateStrongPassword = generateStrongPassword;
const generateToken = () => {
    return crypto.randomBytes(16).toString("hex");
};
exports.generateToken = generateToken;
//# sourceMappingURL=utils.js.map