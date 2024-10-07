import { Injectable, Logger } from "@nestjs/common";
import * as crypto from "crypto";
import { promisify } from "util";
import { exec } from "child_process";
import { existsSync } from "fs";

import { KubernetesClientService } from "../kubernetes-management/kubernetes-client.service";

@Injectable()
export class UtilsService {
  private readonly logger = new Logger(UtilsService.name);
  constructor(
    private readonly kubernetesClientService: KubernetesClientService,
  ) {}

  public async createSecret(
    secretName: string,
    namespace: string,
    secretData: Record<string, string>,
  ): Promise<void> {
    try {
      await this.kubernetesClientService.k8sCoreApi.readNamespacedSecret(
        secretName,
        namespace,
      );
      this.logger.log(
        `Secret '${secretName}' already exists, skipping creation.`,
      );
    } catch (err) {
      if (err.response && err.response.statusCode === 404) {
        this.logger.log(
          `Creating Secret '${secretName}' in namespace '${namespace}'...`,
        );
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
        await this.kubernetesClientService.k8sCoreApi.createNamespacedSecret(
          namespace,
          secretManifest,
        );
        this.logger.log(
          `Secret '${secretName}' created successfully with generated credentials.`,
        );
      } else {
        this.logger.error(`Failed to check/create secret: ${err.message}`);
        throw new Error(`Failed to create secret: ${err.message}`);
      }
    }
  }

  /**
   * Retrieve the service URL based on the service name, namespace, and service type.
   * This method supports different ports for different services.
   * @param serviceName The name of the service.
   * @param namespace The namespace where the service is located.
   * @param serviceType The type of service being accessed (e.g., 'InfluxDB' or 'Grafana').
   * @returns The URL of the service.
   */
  public async getDeploymentUrl(
    serviceName: string,
    namespace: string,
    serviceType: "InfluxDB" | "Grafana" | "JMeterMaster" | "JMeterSlave",
  ): Promise<string> {
    try {
      const service =
        await this.kubernetesClientService.k8sCoreApi.readNamespacedService(
          serviceName,
          namespace,
        );
      const { spec, status } = service.body;

      // Define port mapping for different services
      const servicePorts: { [key: string]: number } = {
        InfluxDB: 8086, // Default port for InfluxDB
        Grafana: 3000, // Default port for Grafana
        JMeterMaster: 1099, // Default port for JMeter Master (example)
        JMeterSlave: 50000, // Default port for JMeter Slave (example)
      };

      // Get the port based on the service type
      const port = servicePorts[serviceType] || 80; // Default to port 80 if not specified

      // If the service has an external LoadBalancer, get its external IP
      if (spec.type === "LoadBalancer" && status.loadBalancer.ingress) {
        const externalIP =
          status.loadBalancer.ingress[0].ip ||
          status.loadBalancer.ingress[0].hostname;
        return `http://${externalIP}:${port}`;
      }

      // Otherwise, get the ClusterIP of the service
      const clusterIP = spec.clusterIP;
      return `http://${clusterIP}:${port}`;
    } catch (err) {
      this.logger.error(`Failed to get ${serviceName} URL: ${err.message}`);
      throw new Error(`Failed to get ${serviceName} URL: ${err.message}`);
    }
  }

  public async deployResourceFromYaml(
    yamlFilePath: string,
    namespace: string,
  ): Promise<string> {
    const execPromise = promisify(exec);

    if (!existsSync(yamlFilePath)) {
      throw new Error(`YAML file not found: ${yamlFilePath}`);
    }

    const quotedYamlFilePath = `"${yamlFilePath}"`;
    try {
      const { stdout, stderr } = await execPromise(
        `kubectl apply -f ${quotedYamlFilePath} --namespace=${namespace}`,
      );
      if (stderr) {
        this.logger.error(
          `Error deploying resource from ${yamlFilePath}: ${stderr}`,
        );
        throw new Error(`Deployment failed: ${stderr.trim()}`);
      }
      this.logger.log(`Resource deployed from ${yamlFilePath}: ${stdout}`);
      return stdout;
    } catch (error) {
      this.logger.error(
        `Failed to deploy resource from ${yamlFilePath}: ${error.message}`,
      );
      throw new Error(`Deployment Error: ${error.message}`);
    }
  }

  public async deploymentExists(
    deploymentName: string,
    namespace: string,
  ): Promise<boolean> {
    try {
      await this.kubernetesClientService.k8sAppsApi.readNamespacedDeployment(
        deploymentName,
        namespace,
      );
      return true;
    } catch (err) {
      if (err.response && err.response.statusCode === 404) {
        return false;
      }
      this.logger.error(
        `Error checking deployment ${deploymentName} in namespace ${namespace}: ${err.message}`,
      );
      throw err;
    }
  }

  public generateStrongPassword(): string {
    return crypto.randomBytes(12).toString("hex");
  }

  public generateToken(): string {
    return crypto.randomBytes(16).toString("hex");
  }
}
