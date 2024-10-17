"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectModule = void 0;
const common_1 = require("@nestjs/common");
const infrastructure_module_1 = require("../core/infrastructure/infrastructure.module");
const project_controller_1 = require("../core/presentation/controllers/project.controller");
const select_project_use_case_1 = require("../core/application/use-cases/select-project.use-case");
const delete_project_use_case_1 = require("../core/application/use-cases/delete-project.use-case");
let ProjectModule = class ProjectModule {
};
exports.ProjectModule = ProjectModule;
exports.ProjectModule = ProjectModule = __decorate([
    (0, common_1.Module)({
        imports: [(0, common_1.forwardRef)(() => infrastructure_module_1.InfrastructureModule)],
        controllers: [project_controller_1.ProjectController],
        providers: [select_project_use_case_1.SelectProjectUseCase, delete_project_use_case_1.DeleteProjectUseCase],
    })
], ProjectModule);
//# sourceMappingURL=project.module.js.map