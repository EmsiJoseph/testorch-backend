import {Injectable, Logger, OnModuleInit} from "@nestjs/common";
import * as path from "path";
import {IInfluxdbService} from "../../../application/interfaces/services/influxdb.service.interface";
import {KubernetesService} from "../kubernetes/kubernetes.service";
import {InfluxdbClient} from "../../client/influxdb-client";
import {generateStrongPassword, generateToken,} from "../../../shared/utils/utils";
import {CreateTeamDto} from "../../../presentation/dto/team.dto";

@Injectable()
export class InfluxdbService implements IInfluxdbService, OnModuleInit {
    private readonly logger = new Logger(InfluxdbService.name);
    private readonly namespace: string = "monitoring"; // Default namespace
    private influxdbUrl: string;
    private influxdbToken: string;
    private influxdbPassword: string;

    public isFirstDeployment: boolean = false;

    constructor(
        private readonly kubernetesService: KubernetesService,
        private readonly influxdbClient: InfluxdbClient,
    ) {
    }

    /**
     * Initialize the service when the module is initialized.
     */
    async onModuleInit() {
        this.logger.log("InfluxDB Service initialized.");
    }

    /**
     * Create Kubernetes Secret for InfluxDB configuration if it doesn't exist.
     */
    private async createInfluxDBSecret(): Promise<string> {
        const secretName = "influxdb-env-secrets";
        const influxdbUsername = "admin";
        const influxdbPassword = generateStrongPassword();
        const influxdbToken = generateToken();

        const secretData = {
            INFLUXDB_INIT_USERNAME: influxdbUsername,
            INFLUXDB_INIT_PASSWORD: influxdbPassword,
            INFLUXDB_INIT_ADMIN_TOKEN: influxdbToken,
            INFLUXDB_INIT_ORG: "perf-platform",
            INFLUXDB_INIT_BUCKET: "perf-bucket",
        };

        // Create the secret in Kubernetes
        await this.kubernetesService.createSecret(
            secretName,
            this.namespace,
            secretData,
        );

        // Set the generated credentials for future use
        this.influxdbPassword = influxdbPassword;
        return influxdbToken;
    }

    /**
     * Deploy InfluxDB using Kubernetes if not already deployed.
     */
    async deployInfluxdbIfNotExists(): Promise<string> {
        this.logger.log("Deploying InfluxDB if not exists...");

        const influxdbYaml = path.join(
            process.cwd(),
            "src",
            "static",
            "deployments",
            "influxdb-deployment.yaml",
        );

        // Check if InfluxDB is already deployed
        if (
            await this.kubernetesService.deploymentExists("influxdb", this.namespace)
        ) {
            this.logger.log(
                "InfluxDB deployment already exists, skipping deployment.",
            );
            this.influxdbUrl = await this.getInfluxdbUrl();
            this.influxdbClient.setConfig(this.influxdbUrl, this.influxdbToken);
            return "InfluxDB already deployed";
        }

        // Create InfluxDB secret and deploy if not already deployed
        const token = await this.createInfluxDBSecret();
        await this.kubernetesService.deployResourceFromYaml(
            influxdbYaml,
            this.namespace,
        );

        // Update the deployment state
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

    /**
     * Get the InfluxDB URL from Kubernetes.
     */
    async getInfluxdbUrl(): Promise<string> {
        return await this.kubernetesService.getDeploymentUrl(
            "influxdb",
            this.namespace,
            "InfluxDB",
        );
    }

    /**
     * Create a new InfluxDB organization if it doesn't exist.
     * @param event
     */
    async createInfluxdbOrg(
        createTeamDto: CreateTeamDto,
    ) {
        this.influxdbClient.setConfig(
            "http://localhost:8086",
            "9724c2ddbdc338b25d17d16e7927c84f",
        );

        const orgExists = await this.influxdbClient.orgExists(createTeamDto.name)
        if (orgExists) {
            const orgId = await this.influxdbClient.getOrgIdByName(createTeamDto.name)
            throw new Error(`Organization '${createTeamDto.name}' already exists with ID: ${orgId}`);
        }

        return await this.influxdbClient.createOrg(createTeamDto.name);
    }

    // Placeholder methods for other CRUD operations
    async getInfluxdbOrg(): Promise<any> {
        return "TODO";
    }

    async deleteInfluxdbOrg(): Promise<any> {
        return "TODO";
    }

    async listInfluxdbOrgs(): Promise<any> {
        return "TODO";
    }

    async getInfluxdbToken(): Promise<any> {
        return "TODO";
    }
}
