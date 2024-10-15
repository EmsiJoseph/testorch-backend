"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadGeneratorModule = void 0;
const common_1 = require("@nestjs/common");
const load_generator_controller_1 = require("./load-generator.controller");
const load_generator_service_1 = require("./load-generator.service");
const test_plan_service_1 = require("../test-plan/test-plan.service");
let LoadGeneratorModule = class LoadGeneratorModule {
};
exports.LoadGeneratorModule = LoadGeneratorModule;
exports.LoadGeneratorModule = LoadGeneratorModule = __decorate([
    (0, common_1.Module)({
        controllers: [load_generator_controller_1.LoadGeneratorController],
        providers: [load_generator_service_1.LoadGeneratorService, test_plan_service_1.TestPlanService],
        exports: [load_generator_service_1.LoadGeneratorService],
    })
], LoadGeneratorModule);
//# sourceMappingURL=load-generator.module.js.map