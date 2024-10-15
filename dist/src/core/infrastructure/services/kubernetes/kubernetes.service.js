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
var KubernetesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KubernetesService = void 0;
const common_1 = require("@nestjs/common");
const util_1 = require("util");
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const kubernetes_client_1 = require("../../client/kubernetes-client");
const grafana_service_1 = require("../grafana/grafana.service");
const influxdb_service_1 = require("../influxdb/influxdb.service");
const jmeter_service_1 = require("../jmeter/jmeter.service");
let KubernetesService = KubernetesService_1 = class KubernetesService {
    influxdbService;
    kubernetesClient;
    grafanaService;
    jmeterService;
    logger = new common_1.Logger(KubernetesService_1.name);
    constructor(influxdbService, kubernetesClient, grafanaService, jmeterService) {
        this.influxdbService = influxdbService;
        this.kubernetesClient = kubernetesClient;
        this.grafanaService = grafanaService;
        this.jmeterService = jmeterService;
    }
    async onModuleInit() {
        this.logger.log("Initializing Kubernetes namespaces and deployments...");
        const namespaces = ["perf-platform", "monitoring"];
        for (const namespace of namespaces) {
            await this.createNamespaceIfNotExists(namespace);
        }
        await this.initializeDeployments();
    }
    async initializeDeployments() {
        await this.grafanaService.deployGrafanaIfNotExists();
        await this.influxdbService.deployInfluxdbIfNotExists();
        await this.jmeterService.deployJmeterMasterIfNotExists();
        await this.jmeterService.deployJmeterSlavesIfNotExists();
        this.logger.log("All deployments have been successfully initialized.");
    }
    async createNamespaceIfNotExists(namespace) {
        try {
            await this.kubernetesClient.k8sCoreApi.readNamespace(namespace);
            this.logger.log(`Namespace ${namespace} already exists, skipping creation.`);
        }
        catch (err) {
            if (this.isKubernetesHttpError(err) && err.response?.statusCode === 404) {
                this.logger.log(`Creating namespace ${namespace}...`);
                await this.kubernetesClient.k8sCoreApi.createNamespace({
                    metadata: { name: namespace },
                });
                this.logger.log(`Namespace ${namespace} created.`);
            }
            else {
                const errorMessage = this.getErrorMessage(err);
                this.logger.error(`Error checking/creating namespace: ${errorMessage}`);
                throw new Error(`Error checking/creating namespace: ${errorMessage}`);
            }
        }
    }
    async createSecret(secretName, namespace, secretData) {
        try {
            await this.kubernetesClient.k8sCoreApi.readNamespacedSecret(secretName, namespace);
            this.logger.log(`Secret '${secretName}' already exists, skipping creation.`);
        }
        catch (err) {
            if (this.isKubernetesHttpError(err) && err.response?.statusCode === 404) {
                this.logger.log(`Creating Secret '${secretName}' in namespace '${namespace}'...`);
                const secretManifest = {
                    apiVersion: "v1",
                    kind: "Secret",
                    metadata: { name: secretName, namespace },
                    data: Object.fromEntries(Object.entries(secretData).map(([key, value]) => [
                        key,
                        Buffer.from(value).toString("base64"),
                    ])),
                };
                await this.kubernetesClient.k8sCoreApi.createNamespacedSecret(namespace, secretManifest);
                this.logger.log(`Secret '${secretName}' created successfully with generated credentials.`);
            }
            else {
                const errorMessage = this.getErrorMessage(err);
                this.logger.error(`Failed to check/create secret: ${errorMessage}`);
                throw new Error(`Failed to create secret: ${errorMessage}`);
            }
        }
    }
    async getSecret(secretName, namespace) {
        try {
            const response = await this.kubernetesClient.k8sCoreApi.readNamespacedSecret(secretName, namespace);
            this.logger.log(`Successfully retrieved secret '${secretName}'`);
            return response.body;
        }
        catch (err) {
            const errorMessage = this.getErrorMessage(err);
            this.logger.error(`Failed to get secret '${secretName}': ${errorMessage}`);
            throw new Error(`Failed to get secret '${secretName}': ${errorMessage}`);
        }
    }
    async getDeploymentUrl(serviceName, namespace, serviceType) {
        try {
            const service = await this.kubernetesClient.k8sCoreApi.readNamespacedService(serviceName, namespace);
            const servicePorts = {
                InfluxDB: 8086,
                Grafana: 32000,
                JMeterMaster: 1099,
                JMeterSlave: 50000,
            };
            const port = servicePorts[serviceType] || 80;
            return `http://localhost:${port}`;
        }
        catch (err) {
            const errorMessage = this.getErrorMessage(err);
            this.logger.error(`Failed to get ${serviceName} URL: ${errorMessage}`);
            throw new Error(`Failed to get ${serviceName} URL: ${errorMessage}`);
        }
    }
    async deployResourceFromYaml(yamlFilePath, namespace) {
        const execPromise = (0, util_1.promisify)(child_process_1.exec);
        if (!(0, fs_1.existsSync)(yamlFilePath)) {
            throw new Error(`YAML file not found: ${yamlFilePath}`);
        }
        const quotedYamlFilePath = `"${yamlFilePath}"`;
        try {
            const { stdout, stderr } = await execPromise(`kubectl apply -f ${quotedYamlFilePath} --namespace=${namespace}`);
            if (stderr) {
                this.logger.error(`Error deploying resource from ${yamlFilePath}: ${stderr}`);
                throw new Error(`Deployment failed: ${stderr.trim()}`);
            }
            this.logger.log(`Resource deployed from ${yamlFilePath}: ${stdout}`);
            return stdout;
        }
        catch (error) {
            const errorMessage = this.getErrorMessage(error);
            this.logger.error(`Failed to deploy resource from ${yamlFilePath}: ${errorMessage}`);
            throw new Error(`Deployment Error: ${errorMessage}`);
        }
    }
    async deploymentExists(deploymentName, namespace) {
        try {
            await this.kubernetesClient.k8sAppsApi.readNamespacedDeployment(deploymentName, namespace);
            return true;
        }
        catch (err) {
            if (this.isKubernetesHttpError(err) && err.response?.statusCode === 404) {
                return false;
            }
            const errorMessage = this.getErrorMessage(err);
            this.logger.error(`Error checking deployment ${deploymentName} in namespace ${namespace}: ${errorMessage}`);
            throw err;
        }
    }
    isKubernetesHttpError(error) {
        return (error instanceof Error &&
            "response" in error &&
            error.response?.statusCode !== undefined);
    }
    getErrorMessage(error) {
        if (error instanceof Error) {
            return error.message;
        }
        if (this.isKubernetesHttpError(error)) {
            return error.response?.body?.message || JSON.stringify(error.response?.body);
        }
        return 'Unknown error occurred';
    }
};
exports.KubernetesService = KubernetesService;
exports.KubernetesService = KubernetesService = KubernetesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => influxdb_service_1.InfluxdbService))),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => grafana_service_1.GrafanaService))),
    __metadata("design:paramtypes", [influxdb_service_1.InfluxdbService,
        kubernetes_client_1.KubernetesClient,
        grafana_service_1.GrafanaService,
        jmeter_service_1.JmeterService])
], KubernetesService);
//# sourceMappingURL=kubernetes.service.js.map