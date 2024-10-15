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
var GrafanaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrafanaService = void 0;
const common_1 = require("@nestjs/common");
const path = require("path");
const event_emitter_1 = require("@nestjs/event-emitter");
const utils_1 = require("../../../shared/utils/utils");
const kubernetes_service_1 = require("../kubernetes/kubernetes.service");
let GrafanaService = GrafanaService_1 = class GrafanaService {
    kubernetesService;
    logger = new common_1.Logger(GrafanaService_1.name);
    grafanaUrl;
    grafanaUsername;
    grafanaPassword;
    namespace = "monitoring";
    constructor(kubernetesService) {
        this.kubernetesService = kubernetesService;
    }
    onModuleInit() {
        this.logger.log("GrafanaService has been initialized and is ready to listen to events.");
    }
    async createGrafanaSecret(namespace) {
        const secretName = "grafana-env-secrets";
        this.grafanaUsername = "admin";
        this.grafanaPassword = (0, utils_1.generateStrongPassword)();
        const secretData = {
            GF_SECURITY_ADMIN_USER: this.grafanaUsername,
            GF_SECURITY_ADMIN_PASSWORD: this.grafanaPassword,
        };
        await this.kubernetesService.createSecret(secretName, namespace, secretData);
    }
    async deployGrafanaIfNotExists() {
        this.logger.log("Received 'kubernetes.init' event, deploying Grafana...");
        const grafanaYaml = path.join(process.cwd(), "src", "static", "deployments", "grafana-deployment.yaml");
        const namespace = this.namespace;
        const deploymentName = "grafana";
        await this.createGrafanaSecret(namespace);
        if (await this.kubernetesService.deploymentExists(deploymentName, namespace)) {
            this.logger.log("Grafana deployment already exists, skipping deployment.");
            this.grafanaUrl = await this.kubernetesService.getDeploymentUrl(deploymentName, namespace, "Grafana");
            return "Grafana already deployed";
        }
        await this.kubernetesService.deployResourceFromYaml(grafanaYaml, namespace);
        this.grafanaUrl = await this.kubernetesService.getDeploymentUrl(deploymentName, namespace, "Grafana");
        this.logger.log(`Grafana Deployment Information:
      - URL: ${this.grafanaUrl}
      - Username: ${this.grafanaUsername}
      - Password: ${this.grafanaPassword}
    `);
        return "Grafana deployed";
    }
    async createDatasource(data) {
        return `TODO ${data}`;
    }
    async getDatasource(name) {
        return `TODO ${name}`;
    }
    async deleteDatasource(id) {
        return `TODO ${id}`;
    }
    async listDashboards() {
        return `TODO`;
    }
    async createDashboard(dashboard) {
        return `TODO ${dashboard}`;
    }
    async getDashboard(name) {
        return `TODO ${name}`;
    }
    async deleteDashboard(id) {
        return `TODO ${id}`;
    }
};
exports.GrafanaService = GrafanaService;
__decorate([
    (0, event_emitter_1.OnEvent)("kubernetes.init", { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GrafanaService.prototype, "deployGrafanaIfNotExists", null);
exports.GrafanaService = GrafanaService = GrafanaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => kubernetes_service_1.KubernetesService))),
    __metadata("design:paramtypes", [kubernetes_service_1.KubernetesService])
], GrafanaService);
//# sourceMappingURL=grafana.service.js.map