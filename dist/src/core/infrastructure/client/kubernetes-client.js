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
var KubernetesClient_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KubernetesClient = void 0;
const k8s = require("@kubernetes/client-node");
const common_1 = require("@nestjs/common");
const http_1 = require("http");
let KubernetesClient = KubernetesClient_1 = class KubernetesClient {
    logger = new common_1.Logger(KubernetesClient_1.name);
    k8sCoreApi;
    k8sRbacApi;
    k8sAppsApi;
    constructor() {
        const kc = new k8s.KubeConfig();
        this.logger.log("Using local kubeconfig file for Kubernetes configuration.");
        kc.loadFromDefault();
        this.k8sCoreApi = kc.makeApiClient(k8s.CoreV1Api);
        this.k8sRbacApi = kc.makeApiClient(k8s.RbacAuthorizationV1Api);
        this.k8sAppsApi = kc.makeApiClient(k8s.AppsV1Api);
    }
    async createNamespace(namespace) {
        try {
            const namespaceExists = await this.namespaceExists(namespace);
            if (namespaceExists) {
                this.logger.log(`Namespace ${namespace} already exists. Skipping creation.`);
                return;
            }
            await this.k8sCoreApi.createNamespace({ metadata: { name: namespace } });
            this.logger.log(`Namespace ${namespace} created successfully.`);
        }
        catch (error) {
            this.handleKubernetesError(error, `Failed to create namespace '${namespace}'`);
        }
    }
    async createSecret(namespace, secretManifest) {
        try {
            const existingSecret = await this.getSecret(namespace, secretManifest.metadata?.name);
            if (existingSecret) {
                this.logger.log(`Secret '${secretManifest.metadata?.name}' already exists in namespace '${namespace}'. Skipping creation.`);
                return;
            }
        }
        catch (error) {
            if (this.isKubernetesError(error) && error.response?.statusCode !== 404) {
                this.logger.error(`Failed to check for secret existence in namespace '${namespace}': ${error.response?.body?.message || error.message}`);
                throw error;
            }
        }
        try {
            await this.k8sCoreApi.createNamespacedSecret(namespace, secretManifest);
            this.logger.log(`Secret '${secretManifest.metadata?.name}' created successfully.`);
        }
        catch (error) {
            this.handleKubernetesError(error, `Failed to create secret in namespace '${namespace}'`);
        }
    }
    async getSecret(namespace, secretName) {
        try {
            return (await this.k8sCoreApi.readNamespacedSecret(secretName, namespace)).body;
        }
        catch (error) {
            this.handleKubernetesError(error, `Failed to get secret '${secretName}' in namespace '${namespace}'`);
        }
    }
    async createRole(namespace, roleManifest) {
        try {
            await this.k8sRbacApi.createNamespacedRole(namespace, roleManifest);
            this.logger.log(`Role '${roleManifest.metadata?.name}' created successfully in namespace '${namespace}'.`);
        }
        catch (error) {
            this.handleKubernetesError(error, `Failed to create role in namespace '${namespace}'`);
        }
    }
    async createRoleBinding(namespace, roleBindingManifest) {
        try {
            await this.k8sRbacApi.createNamespacedRoleBinding(namespace, roleBindingManifest);
            this.logger.log(`RoleBinding '${roleBindingManifest.metadata?.name}' created successfully in namespace '${namespace}'.`);
        }
        catch (error) {
            this.handleKubernetesError(error, `Failed to create role binding in namespace '${namespace}'`);
        }
    }
    async namespaceExists(namespace) {
        try {
            await this.k8sCoreApi.readNamespace(namespace);
            return true;
        }
        catch (error) {
            if (this.isKubernetesError(error) && error.response?.statusCode === 404) {
                return false;
            }
            this.handleKubernetesError(error, `Error checking namespace existence '${namespace}'`);
        }
    }
    async deploymentExists(deploymentName, namespace) {
        try {
            await this.k8sAppsApi.readNamespacedDeployment(deploymentName, namespace);
            return true;
        }
        catch (error) {
            if (this.isKubernetesError(error) && error.response?.statusCode === 404) {
                return false;
            }
            this.handleKubernetesError(error, `Error checking deployment existence '${deploymentName}' in namespace '${namespace}'`);
        }
    }
    async getServiceUrl(serviceName, namespace, serviceType) {
        try {
            const servicePorts = {
                InfluxDB: 8086,
                Grafana: 32000,
                JMeterMaster: 1099,
                JMeterSlave: 50000,
            };
            return `http://localhost:${servicePorts[serviceType]}`;
        }
        catch (err) {
            if (err instanceof Error) {
                this.logger.error(`Failed to get service URL for '${serviceName}': ${err.message}`);
                throw new Error(`Failed to get service URL for '${serviceName}': ${err.message}`);
            }
            else {
                this.logger.error(`Unknown error: ${err}`);
                throw new Error(`Unknown error while getting service URL for '${serviceName}'.`);
            }
        }
    }
    isKubernetesError(error) {
        return (error instanceof Error &&
            'response' in error &&
            error.response instanceof http_1.IncomingMessage);
    }
    handleKubernetesError(error, message) {
        if (this.isKubernetesError(error)) {
            const response = error.response;
            const statusCode = response?.statusCode;
            const responseBody = response.body?.message || JSON.stringify(response.body);
            this.logger.error(`${message}: ${responseBody} (Status Code: ${statusCode})`);
            throw new Error(`${message}: ${responseBody} (Status Code: ${statusCode})`);
        }
        else if (error instanceof Error) {
            this.logger.error(`${message}: ${error.message}`);
            throw new Error(`${message}: ${error.message}`);
        }
        else {
            this.logger.error(`Unknown error: ${message}`, error);
            throw new Error(`Unknown error: ${message}`);
        }
    }
};
exports.KubernetesClient = KubernetesClient;
exports.KubernetesClient = KubernetesClient = KubernetesClient_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], KubernetesClient);
//# sourceMappingURL=kubernetes-client.js.map