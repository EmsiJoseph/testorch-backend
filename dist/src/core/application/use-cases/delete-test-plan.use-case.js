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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteTestPlanUseCase = void 0;
const common_1 = require("@nestjs/common");
const test_plan_repository_1 = require("../../infrastructure/repositories/test-plan/test-plan.repository");
let DeleteTestPlanUseCase = class DeleteTestPlanUseCase {
    testPlanRepo;
    constructor(testPlanRepo) {
        this.testPlanRepo = testPlanRepo;
    }
    async execute(team, project, plan, sha) {
        console.log(`Deleting Test Plan - Team: ${team}, Project: ${project}, Plan: ${plan}, SHA: ${sha}`);
        if (!team || !project || !plan || !sha) {
            throw new common_1.HttpException('Invalid input parameters', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const response = await this.testPlanRepo.deleteTestPlan(team, project, plan, sha);
            console.log('Delete Test Plan Response:', response);
            return response;
        }
        catch (error) {
            console.error('Error deleting test plan:', error);
            throw new common_1.HttpException('Failed to delete test plan from repository', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.DeleteTestPlanUseCase = DeleteTestPlanUseCase;
exports.DeleteTestPlanUseCase = DeleteTestPlanUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [test_plan_repository_1.TestPlanRepository])
], DeleteTestPlanUseCase);
//# sourceMappingURL=delete-test-plan.use-case.js.map