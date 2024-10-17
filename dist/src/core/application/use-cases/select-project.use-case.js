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
exports.SelectProjectUseCase = void 0;
const common_1 = require("@nestjs/common");
const project_repository_1 = require("../../infrastructure/repositories/project/project.repository");
let SelectProjectUseCase = class SelectProjectUseCase {
    projectRepo;
    constructor(projectRepo) {
        this.projectRepo = projectRepo;
    }
    async execute(team, project) {
        const projects = await this.projectRepo.getProjects(team, project);
        const modifiedProjects = projects.map((project) => ({
            projectName: project.name,
            projectPath: project.path,
            projectID: project.sha,
        }));
        return modifiedProjects;
    }
};
exports.SelectProjectUseCase = SelectProjectUseCase;
exports.SelectProjectUseCase = SelectProjectUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [project_repository_1.ProjectRepository])
], SelectProjectUseCase);
//# sourceMappingURL=select-project.use-case.js.map