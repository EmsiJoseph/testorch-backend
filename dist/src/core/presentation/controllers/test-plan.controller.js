"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestPlanController = void 0;
const common_1 = require("@nestjs/common");
const select_test_plan_use_case_1 = require("../../../core/application/use-cases/select-test-plan.use-case");
const delete_test_plan_use_case_1 = require("../../../core/application/use-cases/delete-test-plan.use-case");
let TestPlanController = class TestPlanController {
    selectTestPlanUseCase;
    deleteTestPlanUseCase;
    constructor(selectTestPlanUseCase, deleteTestPlanUseCase) {
        this.selectTestPlanUseCase = selectTestPlanUseCase;
        this.deleteTestPlanUseCase = deleteTestPlanUseCase;
        console.log('TestPlanController initialized');
    }
    async selectTestPlans(team, project) {
        return this.selectTestPlanUseCase.execute(team, project);
    }
    async deleteTestPlan(team, project, plan, sha) {
        return this.deleteTestPlanUseCase.execute(team, project, plan, sha);
    }
};
exports.TestPlanController = TestPlanController;
__decorate([
    (0, common_1.Get)('select/:team/:project'),
    __param(0, (0, common_1.Param)('team')),
    __param(1, (0, common_1.Param)('project')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TestPlanController.prototype, "selectTestPlans", null);
__decorate([
    (0, common_1.Delete)('delete/:team/:project/:plan/:sha'),
    __param(0, (0, common_1.Param)('team')),
    __param(1, (0, common_1.Param)('project')),
    __param(2, (0, common_1.Param)('plan')),
    __param(3, (0, common_1.Param)('sha')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], TestPlanController.prototype, "deleteTestPlan", null);
exports.TestPlanController = TestPlanController = __decorate([
    (0, common_1.Controller)('test-plan'),
    __metadata("design:paramtypes", [select_test_plan_use_case_1.SelectTestPlanUseCase,
        delete_test_plan_use_case_1.DeleteTestPlanUseCase])
], TestPlanController);
//# sourceMappingURL=test-plan.controller.js.map