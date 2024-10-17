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
exports.ProjectController = void 0;
const common_1 = require("@nestjs/common");
const select_project_use_case_1 = require("../../../core/application/use-cases/select-project.use-case");
const delete_project_use_case_1 = require("../../../core/application/use-cases/delete-project.use-case");
let ProjectController = class ProjectController {
    selectProjectUseCase;
    deleteProjectUseCase;
    constructor(selectProjectUseCase, deleteProjectUseCase) {
        this.selectProjectUseCase = selectProjectUseCase;
        this.deleteProjectUseCase = deleteProjectUseCase;
        console.log('⭐ ProjectController initialized');
    }
    async selectProject(team, project) {
        return this.selectProjectUseCase.execute(team, project);
    }
    async deleteProject(team, project, sha) {
        return this.deleteProjectUseCase.execute(team, project, sha);
    }
};
exports.ProjectController = ProjectController;
__decorate([
    (0, common_1.Get)('select/:team/:project'),
    __param(0, (0, common_1.Param)('team')),
    __param(1, (0, common_1.Param)('project')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "selectProject", null);
__decorate([
    (0, common_1.Delete)('delete/:team/:project/:sha'),
    __param(0, (0, common_1.Param)('team')),
    __param(1, (0, common_1.Param)('project')),
    __param(2, (0, common_1.Param)('sha')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "deleteProject", null);
exports.ProjectController = ProjectController = __decorate([
    (0, common_1.Controller)('project'),
    __metadata("design:paramtypes", [select_project_use_case_1.SelectProjectUseCase,
        delete_project_use_case_1.DeleteProjectUseCase])
], ProjectController);
//# sourceMappingURL=project.controller.js.map