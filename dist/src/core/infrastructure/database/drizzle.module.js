"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrizzleModule = void 0;
const common_1 = require("@nestjs/common");
const auth_constant_1 = require("../../../constants/auth.constant");
const index_1 = require("./index");
let DrizzleModule = class DrizzleModule {
};
exports.DrizzleModule = DrizzleModule;
exports.DrizzleModule = DrizzleModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: auth_constant_1.PG_CONNECTION,
                useValue: index_1.db,
            },
        ],
        exports: [auth_constant_1.PG_CONNECTION],
    })
], DrizzleModule);
//# sourceMappingURL=drizzle.module.js.map