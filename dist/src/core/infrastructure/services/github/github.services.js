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
exports.GitHubService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let GitHubService = class GitHubService {
    httpService;
    githubApiUrl = 'https://api.github.com/repos/AshleyPojol/centralized-testorch-repository/contents';
    owner = 'AshleyPojol';
    repo = 'centralized-testorch-repository';
    token = '';
    constructor(httpService) {
        this.httpService = httpService;
    }
    async getTestPlans(team, project) {
        const path = `teams/${team}/projects/${project}/test-plans`;
        const url = `${this.githubApiUrl}/${path}`;
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, {
                headers: {
                    Authorization: `token ${this.token}`,
                },
            }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException('Failed to fetch test plans from GitHub', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteTestPlan(team, project, plan, sha) {
        const path = `teams/${team}/projects/${project}/test-plans/${plan}`;
        const url = `${this.githubApiUrl}/${path}`;
        console.log(`Attempting to delete test plan at URL: ${url}`);
        console.log(`Using SHA: ${sha}`);
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.delete(url, {
                headers: {
                    Authorization: `token ${this.token}`,
                },
                data: {
                    message: `Delete test plan: ${plan}`,
                    sha: sha,
                },
            }));
            console.log('GitHub API Response:', response.data);
            return response.data;
        }
        catch (error) {
            console.error('Error deleting test plan:', error.response?.data || error.message);
            throw new common_1.HttpException('Failed to delete test plan from GitHub', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.GitHubService = GitHubService;
exports.GitHubService = GitHubService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], GitHubService);
//# sourceMappingURL=github.services.js.map