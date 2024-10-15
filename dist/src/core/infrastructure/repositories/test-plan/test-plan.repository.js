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
exports.TestPlanRepository = void 0;
const common_1 = require("@nestjs/common");
const github_services_1 = require("../../services/github/github.services");
let TestPlanRepository = class TestPlanRepository {
    githubService;
    constructor(githubService) {
        this.githubService = githubService;
    }
    async getTestPlans(team, project) {
        return this.githubService.getTestPlans(team, project);
    }
    async deleteTestPlan(team, project, plan, sha) {
        return this.githubService.deleteTestPlan(team, project, plan, sha);
    }
};
exports.TestPlanRepository = TestPlanRepository;
exports.TestPlanRepository = TestPlanRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [github_services_1.GitHubService])
], TestPlanRepository);
//# sourceMappingURL=test-plan.repository.js.map