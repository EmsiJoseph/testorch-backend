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
var JmeterService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JmeterService = void 0;
const common_1 = require("@nestjs/common");
const path = require("path");
const event_emitter_1 = require("@nestjs/event-emitter");
const kubernetes_service_1 = require("../kubernetes/kubernetes.service");
let JmeterService = JmeterService_1 = class JmeterService {
    kubernetesService;
    logger = new common_1.Logger(JmeterService_1.name);
    namespace = "perf-platform";
    constructor(kubernetesService) {
        this.kubernetesService = kubernetesService;
    }
    async deployJmeterMasterIfNotExists() {
        this.logger.log("Received 'kubernetes.init' event, deploying Jmeter Master...");
        const jmeterMasterYaml = path.join(process.cwd(), "src", "static", "deployments", "jmeter-master-deployment.yaml");
        const namespace = this.namespace;
        if (await this.kubernetesService.deploymentExists("jmeter-master", namespace)) {
            this.logger.log("JMeter Master deployment already exists, skipping deployment.");
            return "JMeter Master already deployed";
        }
        await this.kubernetesService.deployResourceFromYaml(jmeterMasterYaml, namespace);
        return "JMeter Master deployed";
    }
    async deployJmeterSlavesIfNotExists() {
        this.logger.log("Received 'kubernetes.init' event, deploying Jmeter Slaves...");
        const jmeterSlaveYaml = path.join(process.cwd(), "src", "static", "deployments", "jmeter-slave-deployment.yaml");
        const namespace = this.namespace;
        if (await this.kubernetesService.deploymentExists("jmeter-slave", namespace)) {
            this.logger.log("JMeter Slaves deployment already exists, skipping deployment.");
            return "JMeter Slaves already deployed";
        }
        await this.kubernetesService.deployResourceFromYaml(jmeterSlaveYaml, namespace);
        return "JMeter Slaves deployed";
    }
};
exports.JmeterService = JmeterService;
__decorate([
    (0, event_emitter_1.OnEvent)("kubernetes.init", { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JmeterService.prototype, "deployJmeterMasterIfNotExists", null);
__decorate([
    (0, event_emitter_1.OnEvent)("kubernetes.init", { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JmeterService.prototype, "deployJmeterSlavesIfNotExists", null);
exports.JmeterService = JmeterService = JmeterService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => kubernetes_service_1.KubernetesService))),
    __metadata("design:paramtypes", [kubernetes_service_1.KubernetesService])
], JmeterService);
//# sourceMappingURL=jmeter.service.js.map