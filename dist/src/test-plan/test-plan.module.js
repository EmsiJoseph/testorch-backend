"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestPlanModule = void 0;
const common_1 = require("@nestjs/common");
const infrastructure_module_1 = require("../core/infrastructure/infrastructure.module");
const test_plan_controller_1 = require("../core/presentation/controllers/test-plan.controller");
const select_test_plan_use_case_1 = require("../core/application/use-cases/select-test-plan.use-case");
const delete_test_plan_use_case_1 = require("../core/application/use-cases/delete-test-plan.use-case");
let TestPlanModule = class TestPlanModule {
};
exports.TestPlanModule = TestPlanModule;
exports.TestPlanModule = TestPlanModule = __decorate([
    (0, common_1.Module)({
        imports: [(0, common_1.forwardRef)(() => infrastructure_module_1.InfrastructureModule)],
        controllers: [test_plan_controller_1.TestPlanController],
        providers: [select_test_plan_use_case_1.SelectTestPlanUseCase, delete_test_plan_use_case_1.DeleteTestPlanUseCase],
    })
], TestPlanModule);
//# sourceMappingURL=test-plan.module.js.map