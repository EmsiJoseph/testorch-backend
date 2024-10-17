"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfrastructureModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const event_emitter_1 = require("@nestjs/event-emitter");
const influxdb_service_1 = require("./services/influxdb/influxdb.service");
const grafana_service_1 = require("./services/grafana/grafana.service");
const jmeter_service_1 = require("./services/jmeter/jmeter.service");
const kubernetes_service_1 = require("./services/kubernetes/kubernetes.service");
const authentication_service_1 = require("./services/auth/authentication.service");
const github_services_1 = require("./services/github/github.services");
const kubernetes_client_1 = require("./client/kubernetes-client");
const influxdb_client_1 = require("./client/influxdb-client");
const team_repository_1 = require("./repositories/team/team.repository");
const project_repository_1 = require("./repositories/project/project.repository");
const users_repository_1 = require("./repositories/users/users.repository");
const test_plan_repository_1 = require("./repositories/test-plan/test-plan.repository");
const users_repository_interface_1 = require("../application/interfaces/repositories/users.repository.interface");
const test_plan_module_1 = require("../../test-plan/test-plan.module");
const project_module_1 = require("../../project/project.module");
const drizzle_module_1 = require("./database/drizzle.module");
let InfrastructureModule = class InfrastructureModule {
};
exports.InfrastructureModule = InfrastructureModule;
exports.InfrastructureModule = InfrastructureModule = __decorate([
    (0, common_1.Module)({
        imports: [
            event_emitter_1.EventEmitterModule.forRoot(),
            (0, common_1.forwardRef)(() => InfrastructureModule),
            drizzle_module_1.DrizzleModule,
            (0, common_1.forwardRef)(() => test_plan_module_1.TestPlanModule),
            (0, common_1.forwardRef)(() => project_module_1.ProjectModule),
            axios_1.HttpModule,
        ],
        providers: [
            influxdb_service_1.InfluxdbService,
            influxdb_client_1.InfluxdbClient,
            kubernetes_service_1.KubernetesService,
            grafana_service_1.GrafanaService,
            jmeter_service_1.JmeterService,
            kubernetes_client_1.KubernetesClient,
            team_repository_1.TeamRepository,
            test_plan_repository_1.TestPlanRepository,
            project_repository_1.ProjectRepository,
            github_services_1.GitHubService,
            authentication_service_1.AuthenticationService,
            {
                provide: users_repository_interface_1.USERS_REPOSITORY_TOKEN,
                useClass: users_repository_1.UsersRepository,
            }
        ],
        exports: [
            team_repository_1.TeamRepository,
            grafana_service_1.GrafanaService,
            jmeter_service_1.JmeterService,
            influxdb_service_1.InfluxdbService,
            kubernetes_service_1.KubernetesService,
            influxdb_client_1.InfluxdbClient,
            test_plan_repository_1.TestPlanRepository,
            project_repository_1.ProjectRepository,
            authentication_service_1.AuthenticationService,
            github_services_1.GitHubService,
            users_repository_interface_1.USERS_REPOSITORY_TOKEN,
        ],
    })
], InfrastructureModule);
//# sourceMappingURL=infrastructure.module.js.map