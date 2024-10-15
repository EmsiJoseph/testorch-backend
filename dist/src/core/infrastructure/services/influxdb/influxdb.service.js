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
var InfluxdbService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfluxdbService = void 0;
const common_1 = require("@nestjs/common");
const path = require("path");
const kubernetes_service_1 = require("../kubernetes/kubernetes.service");
const influxdb_client_1 = require("../../client/influxdb-client");
const utils_1 = require("../../../shared/utils/utils");
let InfluxdbService = InfluxdbService_1 = class InfluxdbService {
    kubernetesService;
    influxdbClient;
    logger = new common_1.Logger(InfluxdbService_1.name);
    namespace = "monitoring";
    influxdbUrl;
    influxdbToken;
    influxdbPassword;
    isFirstDeployment = false;
    constructor(kubernetesService, influxdbClient) {
        this.kubernetesService = kubernetesService;
        this.influxdbClient = influxdbClient;
    }
    async onModuleInit() {
        this.logger.log("InfluxDB Service initialized.");
    }
    async createInfluxDBSecret() {
        const secretName = "influxdb-env-secrets";
        const influxdbUsername = "admin";
        const influxdbPassword = (0, utils_1.generateStrongPassword)();
        const influxdbToken = (0, utils_1.generateToken)();
        const secretData = {
            INFLUXDB_INIT_USERNAME: influxdbUsername,
            INFLUXDB_INIT_PASSWORD: influxdbPassword,
            INFLUXDB_INIT_ADMIN_TOKEN: influxdbToken,
            INFLUXDB_INIT_ORG: "perf-platform",
            INFLUXDB_INIT_BUCKET: "perf-bucket",
        };
        await this.kubernetesService.createSecret(secretName, this.namespace, secretData);
        this.influxdbPassword = influxdbPassword;
        return influxdbToken;
    }
    async deployInfluxdbIfNotExists() {
        this.logger.log("Deploying InfluxDB if not exists...");
        const influxdbYaml = path.join(process.cwd(), "src", "static", "deployments", "influxdb-deployment.yaml");
        if (await this.kubernetesService.deploymentExists("influxdb", this.namespace)) {
            this.logger.log("InfluxDB deployment already exists, skipping deployment.");
            this.influxdbUrl = await this.getInfluxdbUrl();
            this.influxdbClient.setConfig(this.influxdbUrl, this.influxdbToken);
            return "InfluxDB already deployed";
        }
        const token = await this.createInfluxDBSecret();
        await this.kubernetesService.deployResourceFromYaml(influxdbYaml, this.namespace);
        this.isFirstDeployment = true;
        this.influxdbUrl = await this.getInfluxdbUrl();
        this.influxdbToken = token;
        this.influxdbClient.setConfig(this.influxdbUrl, this.influxdbToken);
        this.logger.log(`InfluxDB deployed successfully:
      - URL: ${this.influxdbUrl}
      - Token: ${this.influxdbToken}
      - Password: ${this.influxdbPassword}
    `);
        return "InfluxDB deployed successfully";
    }
    async getInfluxdbUrl() {
        return await this.kubernetesService.getDeploymentUrl("influxdb", this.namespace, "InfluxDB");
    }
    async createInfluxdbOrg(createTeamDto) {
        this.influxdbClient.setConfig("http://localhost:8086", "9724c2ddbdc338b25d17d16e7927c84f");
        const orgExists = await this.influxdbClient.orgExists(createTeamDto.name);
        if (orgExists) {
            const orgId = await this.influxdbClient.getOrgIdByName(createTeamDto.name);
            throw new Error(`Organization '${createTeamDto.name}' already exists with ID: ${orgId}`);
        }
        return await this.influxdbClient.createOrg(createTeamDto.name);
    }
    async getInfluxdbOrg() {
        return "TODO";
    }
    async deleteInfluxdbOrg() {
        return "TODO";
    }
    async listInfluxdbOrgs() {
        return "TODO";
    }
    async getInfluxdbToken() {
        return "TODO";
    }
};
exports.InfluxdbService = InfluxdbService;
exports.InfluxdbService = InfluxdbService = InfluxdbService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [kubernetes_service_1.KubernetesService,
        influxdb_client_1.InfluxdbClient])
], InfluxdbService);
//# sourceMappingURL=influxdb.service.js.map