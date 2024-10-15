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
var InfluxdbClient_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfluxdbClient = void 0;
const axios_1 = require("axios");
const common_1 = require("@nestjs/common");
let InfluxdbClient = InfluxdbClient_1 = class InfluxdbClient {
    logger = new common_1.Logger(InfluxdbClient_1.name);
    influxdbApi;
    influxdbToken;
    influxdbUrl;
    constructor() {
        this.influxdbApi = axios_1.default.create();
    }
    setConfig(url, token) {
        this.influxdbUrl = url;
        this.influxdbToken = token;
        this.influxdbApi = axios_1.default.create({
            baseURL: `${this.influxdbUrl}/api/v2/`,
            headers: { Authorization: `Token ${this.influxdbToken}` },
        });
        this.logger.log(`InfluxDBClient configured with base URL: ${this.influxdbUrl}`);
    }
    async orgExists(orgName) {
        try {
            const response = await this.influxdbApi.get(`/orgs`);
            const orgs = response.data.orgs || [];
            const orgExists = orgs.some((org) => org.name === orgName);
            this.logger.log(`Organization '${orgName}' exists: ${orgExists}`);
            return orgExists;
        }
        catch (error) {
            this.handleAxiosError("Error checking if organization exists", error);
        }
    }
    async createOrg(orgName) {
        try {
            const response = await this.influxdbApi.post("/orgs", {
                name: orgName,
            });
            this.logger.log(`Organization '${orgName}' created successfully with ID: ${response.data.id}`);
            return response.data;
        }
        catch (error) {
            this.handleAxiosError("Error creating organization", error);
        }
    }
    async getOrgIdByName(orgName) {
        try {
            const response = await this.influxdbApi.get(`/orgs?org=${orgName}`);
            if (response.data.orgs && response.data.orgs.length > 0) {
                const org = response.data.orgs[0];
                this.logger.log(`Organization '${orgName}' found with ID: ${org.id}`);
                return org.id;
            }
            else {
                throw new common_1.HttpException(`Organization '${orgName}' not found`, common_1.HttpStatus.NOT_FOUND);
            }
        }
        catch (error) {
            this.handleAxiosError("Error retrieving organization by name", error);
        }
    }
    async createBucket(projectName, orgId) {
        try {
            const response = await this.influxdbApi.post("/buckets", {
                name: projectName,
                orgID: orgId,
                retentionRules: [],
            });
            this.logger.log(`Bucket '${projectName}' created successfully with ID: ${response.data.id}`);
            return response.data;
        }
        catch (error) {
            this.handleAxiosError("Error creating bucket", error);
        }
    }
    handleAxiosError(message, error) {
        if (error instanceof axios_1.AxiosError) {
            const status = error.response?.status;
            const statusText = error.response?.statusText;
            const errorData = error.response?.data;
            let errorMessage = `${message}: ${statusText || "Unknown Error"}`;
            switch (status) {
                case 400:
                    errorMessage = `${message}: Bad Request - ${statusText}`;
                    throw new common_1.HttpException(errorMessage, common_1.HttpStatus.BAD_REQUEST);
                case 401:
                    errorMessage = `${message}: Unauthorized - ${statusText}`;
                    throw new common_1.HttpException(errorMessage, common_1.HttpStatus.UNAUTHORIZED);
                case 403:
                    errorMessage = `${message}: Forbidden - ${statusText}`;
                    throw new common_1.HttpException(errorMessage, common_1.HttpStatus.FORBIDDEN);
                case 404:
                    errorMessage = `${message}: Not Found - ${statusText}`;
                    throw new common_1.HttpException(errorMessage, common_1.HttpStatus.NOT_FOUND);
                case 409:
                    errorMessage = `${message}: Conflict - ${statusText}`;
                    throw new common_1.HttpException(errorMessage, common_1.HttpStatus.CONFLICT);
                case 500:
                    errorMessage = `${message}: Internal Server Error - ${statusText}`;
                    throw new common_1.HttpException(errorMessage, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                default:
                    errorMessage = `${message}: ${statusText || "Unknown Error"}`;
                    throw new common_1.HttpException(errorMessage, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        else {
            this.logger.error(`${message}: ${error.message}`);
            throw new common_1.HttpException(`${message}: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.InfluxdbClient = InfluxdbClient;
exports.InfluxdbClient = InfluxdbClient = InfluxdbClient_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], InfluxdbClient);
//# sourceMappingURL=influxdb-client.js.map