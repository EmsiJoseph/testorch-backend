import {
  Injectable,
  OnModuleInit,
  Logger,
  forwardRef,
  Inject,
} from "@nestjs/common";
import { promisify } from "util"; // Import promisify from util
import { exec } from "child_process"; // Import exec from child_process
import { existsSync } from "fs"; // Import existsSync from fs

import { IKubernetesService } from "../../../application/interfaces/services/kubernetes.service.interface";
import { KubernetesClient } from "../../client/kubernetes-client";
import { GrafanaService } from "../grafana/grafana.service";
import { InfluxdbService } from "../influxdb/influxdb.service";
import { JmeterService } from "../jmeter/jmeter.service";
import { KubernetesHttpError } from "../../../domain/errors/common";

@Injectable()
export class KubernetesService implements OnModuleInit, IKubernetesService {
  private readonly logger = new Logger(KubernetesService.name);

  // Injecting required services in the constructor
  constructor(
      @Inject(forwardRef(() => InfluxdbService))
      @Inject(forwardRef(() => GrafanaService))// Use forwardRef for circular dependencies
      private readonly influxdbService: InfluxdbService,
      private readonly kubernetesClient: KubernetesClient,
      private readonly grafanaService: GrafanaService,
      private readonly jmeterService: JmeterService,
  ) {}

  async onModuleInit() {
    this.logger.log("Initializing Kubernetes namespaces and deployments...");

    // Create necessary namespaces
    const namespaces = ["perf-platform", "monitoring"];
    for (const namespace of namespaces) {
      await this.createNamespaceIfNotExists(namespace);
    }

    // Deploy all necessary services sequentially
    await this.initializeDeployments();
  }

  async initializeDeployments(): Promise<void> {
    // Deploy Grafana
    await this.grafanaService.deployGrafanaIfNotExists();

    // Deploy InfluxDB
    await this.influxdbService.deployInfluxdbIfNotExists();

    // Deploy JMeter (Master and Slaves)
    await this.jmeterService.deployJmeterMasterIfNotExists();
    await this.jmeterService.deployJmeterSlavesIfNotExists();

    this.logger.log("All deployments have been successfully initialized.");
  }

  async createNamespaceIfNotExists(namespace: string): Promise<void> {
    try {
      await this.kubernetesClient.k8sCoreApi.readNamespace(namespace);
      this.logger.log(`Namespace ${namespace} already exists, skipping creation.`);
    } catch (err) {
      if (this.isKubernetesHttpError(err) && err.response?.statusCode === 404) {
        this.logger.log(`Creating namespace ${namespace}...`);
        await this.kubernetesClient.k8sCoreApi.createNamespace({
          metadata: { name: namespace },
        });
        this.logger.log(`Namespace ${namespace} created.`);
      } else {
        const errorMessage = this.getErrorMessage(err);
        this.logger.error(`Error checking/creating namespace: ${errorMessage}`);
        throw new Error(`Error checking/creating namespace: ${errorMessage}`);
      }
    }
  }

  public async createSecret(
      secretName: string,
      namespace: string,
      secretData: Record<string, string>,
  ): Promise<void> {
    try {
      await this.kubernetesClient.k8sCoreApi.readNamespacedSecret(secretName, namespace);
      this.logger.log(`Secret '${secretName}' already exists, skipping creation.`);
    } catch (err) {
      if (this.isKubernetesHttpError(err) && err.response?.statusCode === 404) {
        this.logger.log(`Creating Secret '${secretName}' in namespace '${namespace}'...`);
        const secretManifest = {
          apiVersion: "v1",
          kind: "Secret",
          metadata: { name: secretName, namespace },
          data: Object.fromEntries(
              Object.entries(secretData).map(([key, value]) => [
                key,
                Buffer.from(value).toString("base64"),
              ]),
          ),
        };
        await this.kubernetesClient.k8sCoreApi.createNamespacedSecret(namespace, secretManifest);
        this.logger.log(`Secret '${secretName}' created successfully with generated credentials.`);
      } else {
        const errorMessage = this.getErrorMessage(err);
        this.logger.error(`Failed to check/create secret: ${errorMessage}`);
        throw new Error(`Failed to create secret: ${errorMessage}`);
      }
    }
  }

  public async getSecret(secretName: string, namespace: string): Promise<any> {
    try {
      const response = await this.kubernetesClient.k8sCoreApi.readNamespacedSecret(
          secretName,
          namespace,
      );
      this.logger.log(`Successfully retrieved secret '${secretName}'`);
      return response.body;
    } catch (err) {
      const errorMessage = this.getErrorMessage(err);
      this.logger.error(`Failed to get secret '${secretName}': ${errorMessage}`);
      throw new Error(`Failed to get secret '${secretName}': ${errorMessage}`);
    }
  }

  public async getDeploymentUrl(
      serviceName: string,
      namespace: string,
      serviceType: "InfluxDB" | "Grafana" | "JMeterMaster" | "JMeterSlave",
  ): Promise<string> {
    try {
      const service = await this.kubernetesClient.k8sCoreApi.readNamespacedService(
          serviceName,
          namespace,
      );

      // Define port mapping for different services
      const servicePorts: { [key: string]: number } = {
        InfluxDB: 8086, // Default port for InfluxDB
        Grafana: 32000, // Default port for Grafana
        JMeterMaster: 1099, // Default port for JMeter Master (example)
        JMeterSlave: 50000, // Default port for JMeter Slave (example)
      };

      // Get the port based on the service type
      const port = servicePorts[serviceType] || 80; // Default to port 80 if not specified

      return `http://localhost:${port}`;
    } catch (err) {
      const errorMessage = this.getErrorMessage(err);
      this.logger.error(`Failed to get ${serviceName} URL: ${errorMessage}`);
      throw new Error(`Failed to get ${serviceName} URL: ${errorMessage}`);
    }
  }

  public async deployResourceFromYaml(yamlFilePath: string, namespace: string): Promise<string> {
    const execPromise = promisify(exec);

    if (!existsSync(yamlFilePath)) {
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
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      this.logger.error(`Failed to deploy resource from ${yamlFilePath}: ${errorMessage}`);
      throw new Error(`Deployment Error: ${errorMessage}`);
    }
  }

  public async deploymentExists(deploymentName: string, namespace: string): Promise<boolean> {
    try {
      await this.kubernetesClient.k8sAppsApi.readNamespacedDeployment(deploymentName, namespace);
      return true;
    } catch (err) {
      if (this.isKubernetesHttpError(err) && err.response?.statusCode === 404) {
        return false;
      }
      const errorMessage = this.getErrorMessage(err);
      this.logger.error(`Error checking deployment ${deploymentName} in namespace ${namespace}: ${errorMessage}`);
      throw err;
    }
  }

  private isKubernetesHttpError(error: unknown): error is KubernetesHttpError {
    return (
        error instanceof Error &&
        "response" in error &&
        (error as KubernetesHttpError).response?.statusCode !== undefined
    );
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (this.isKubernetesHttpError(error)) {
      return error.response?.body?.message || JSON.stringify(error.response?.body);
    }
    return 'Unknown error occurred';
  }
}
