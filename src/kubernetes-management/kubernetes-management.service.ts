import { Injectable, OnModuleInit } from "@nestjs/common";
import * as k8s from "@kubernetes/client-node";
import { exec } from "child_process";
import { promisify } from "util";
import * as path from "path";
import { existsSync } from "fs";
import * as crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { LoggingService } from "../logging/logging.service"; // Import LoggingService

@Injectable()
export class KubernetesManagementService implements OnModuleInit {
  private readonly kubeConfig: k8s.KubeConfig;
  private readonly k8sCoreApi: k8s.CoreV1Api;
  private readonly k8sAppsApi: k8s.AppsV1Api;

  // Store credentials to log and reference later
  private influxdbUsername: string;
  private influxdbPassword: string;
  private influxdbToken: string;
  private influxdbUrl: string;

  constructor(
    private readonly loggingService: LoggingService, // Inject LoggingService
  ) {
    // Initialize Kubernetes client configuration
    this.kubeConfig = new k8s.KubeConfig();
    this.kubeConfig.loadFromDefault();
    this.k8sCoreApi = this.kubeConfig.makeApiClient(k8s.CoreV1Api);
    this.k8sAppsApi = this.kubeConfig.makeApiClient(k8s.AppsV1Api);
  }

  /**
   * Lifecycle hook that is called once the module has been initialized.
   * This will automatically create namespaces and deploy resources on startup.
   */
  async onModuleInit() {
    this.loggingService.log(
      "Initializing Kubernetes namespaces and deployments...",
    );
    const namespaces = ["perf-platform", "monitoring"];
    for (const namespace of namespaces) {
      await this.createNamespaceIfNotExists(namespace);
    }
    await this.deployInfluxDBIfNotExists(); // Deploy InfluxDB if not already deployed
    await this.deployGrafanaIfNotExists(); // Deploy Grafana if not already deployed
    await this.deployJmeterMasterIfNotExists(); // Deploy JMeter Master if not already deployed
    await this.deployJmeterSlavesIfNotExists(); // Deploy JMeter Slaves if not already deployed
    this.logInfluxDBCredentials();
  }

  /**
   * Ensure the specified namespace exists, and create if not.
   * @param namespace The name of the namespace to ensure.
   */
  async createNamespaceIfNotExists(namespace: string): Promise<void> {
    try {
      await this.k8sCoreApi.readNamespace(namespace);
      this.loggingService.log(
        `Namespace ${namespace} already exists, skipping creation.`,
      );
    } catch (err) {
      if (err.response && err.response.statusCode === 404) {
        this.loggingService.log(`Creating namespace ${namespace}...`);
        await this.k8sCoreApi.createNamespace({
          metadata: { name: namespace },
        });
        this.loggingService.log(`Namespace ${namespace} created.`);
      } else {
        this.loggingService.error(
          `Error checking/creating namespace: ${err.message}`,
        );
        throw err;
      }
    }
  }

  /**
   * Ensure that the InfluxDB Secret is created with the necessary credentials.
   * If it doesn't exist, generate the Secret and store it in Kubernetes.
   * @param namespace The namespace where the secret should be created.
   */
  async createInfluxDBSecret(namespace: string): Promise<void> {
    const secretName = "influxdb-env-secrets";
    this.influxdbUsername = "admin";
    this.influxdbPassword = this.generateStrongPassword();
    this.influxdbToken = uuidv4(); // Generate a UUID for the token

    try {
      // Check if the secret already exists
      await this.k8sCoreApi.readNamespacedSecret(secretName, namespace);
      this.loggingService.log(
        `Secret '${secretName}' already exists in namespace '${namespace}', skipping creation.`,
      );
    } catch (err) {
      if (err.response && err.response.statusCode === 404) {
        this.loggingService.log(
          `Creating Secret '${secretName}' in namespace '${namespace}'...`,
        );

        // Create the secret manifest
        const secretManifest = {
          apiVersion: "v1",
          kind: "Secret",
          metadata: {
            name: secretName,
            namespace,
          },
          data: {
            INFLUXDB_INIT_USERNAME: Buffer.from(this.influxdbUsername).toString(
              "base64",
            ),
            INFLUXDB_INIT_PASSWORD: Buffer.from(this.influxdbPassword).toString(
              "base64",
            ),
            INFLUXDB_INIT_ADMIN_TOKEN: Buffer.from(this.influxdbToken).toString(
              "base64",
            ),
            INFLUXDB_INIT_ORG: Buffer.from("perf-platform").toString("base64"),
            INFLUXDB_INIT_BUCKET: Buffer.from("perf-bucket").toString("base64"),
          },
        };

        // Create the secret in Kubernetes
        await this.k8sCoreApi.createNamespacedSecret(namespace, secretManifest);
        this.loggingService.log(
          `Secret '${secretName}' created successfully with generated credentials.`,
        );
      } else {
        this.loggingService.error(
          `Failed to check/create secret: ${err.message}`,
        );
        throw new Error(`Failed to create secret: ${err.message}`);
      }
    }
  }

  /**
   * Deploy InfluxDB using the YAML file if not already deployed.
   */
  async deployInfluxDBIfNotExists(): Promise<string> {
    const influxdbYaml = path.join(
      process.cwd(),
      "src",
      "kubernetes-management",
      "kubernetes",
      "influxdb-deployment.yaml",
    );

    const namespace = "monitoring";

    // Ensure the secret is created before deploying InfluxDB
    await this.createInfluxDBSecret(namespace);

    // Check if InfluxDB deployment already exists
    if (await this.deploymentExists("influxdb", namespace)) {
      this.loggingService.log(
        "InfluxDB deployment already exists, skipping deployment.",
      );
      return "InfluxDB already deployed";
    }

    // Deploy InfluxDB with the reference to the secret
    const result = await this.deployResourceFromYaml(influxdbYaml, namespace);

    // Set the InfluxDB URL after deployment (replace with your service or external IP if needed)
    this.influxdbUrl = `http://${await this.getServiceClusterIP("influxdb", namespace)}:8086`;
    return result;
  }

  /**
   * Deploy Grafana using the YAML file if not already deployed.
   */
  async deployGrafanaIfNotExists(): Promise<string> {
    const grafanaYaml = path.join(
      process.cwd(),
      "src",
      "kubernetes-management",
      "kubernetes",
      "grafana-deployment.yaml",
    );

    const namespace = "monitoring";

    // Check if Grafana deployment already exists
    if (await this.deploymentExists("grafana", namespace)) {
      this.loggingService.log(
        "Grafana deployment already exists, skipping deployment.",
      );
      return "Grafana already deployed";
    }

    return this.deployResourceFromYaml(grafanaYaml, namespace);
  }

  /**
   * Generate a strong random password.
   * @returns {string} Generated password.
   */
  private generateStrongPassword(): string {
    return crypto.randomBytes(12).toString("hex"); // 12-byte random password
  }

  /**
   * Retrieve the ClusterIP of a given service in a namespace.
   * @param serviceName The name of the service.
   * @param namespace The namespace where the service is located.
   * @returns The ClusterIP of the service.
   */
  private async getServiceClusterIP(
    serviceName: string,
    namespace: string,
  ): Promise<string> {
    try {
      const service = await this.k8sCoreApi.readNamespacedService(
        serviceName,
        namespace,
      );
      return service.body.spec.clusterIP;
    } catch (err) {
      this.loggingService.error(
        `Failed to get ClusterIP for service '${serviceName}': ${err.message}`,
      );
      throw new Error(
        `Failed to get ClusterIP for service '${serviceName}': ${err.message}`,
      );
    }
  }

  /**
   * Deploy JMeter Master using the YAML file if not already deployed.
   */
  async deployJmeterMasterIfNotExists(): Promise<string> {
    const jmeterMasterYaml = path.join(
      process.cwd(),
      "src",
      "kubernetes-management",
      "kubernetes",
      "jmeter-master-deployment.yaml",
    );

    const namespace = "perf-platform";

    // Check if JMeter Master deployment already exists
    if (await this.deploymentExists("jmeter-master", namespace)) {
      this.loggingService.log(
        "JMeter Master deployment already exists, skipping deployment.",
      );
      return "JMeter Master already deployed";
    }

    return this.deployResourceFromYaml(jmeterMasterYaml, namespace);
  }

  /**
   * Deploy JMeter Slaves using the YAML file if not already deployed.
   */
  async deployJmeterSlavesIfNotExists(): Promise<string> {
    const jmeterSlaveYaml = path.join(
      process.cwd(),
      "src",
      "kubernetes-management",
      "kubernetes",
      "jmeter-slave-deployment.yaml",
    );

    const namespace = "perf-platform";

    // Check if JMeter Slaves deployment already exists
    if (await this.deploymentExists("jmeter-slave", namespace)) {
      this.loggingService.log(
        "JMeter Slaves deployment already exists, skipping deployment.",
      );
      return "JMeter Slaves already deployed";
    }

    return this.deployResourceFromYaml(jmeterSlaveYaml, namespace);
  }

  /**
   * Deploy a Kubernetes resource from a YAML file using kubectl.
   * @param yamlFilePath The path to the YAML file.
   * @param namespace The namespace where the resource should be deployed.
   */
  private async deployResourceFromYaml(
    yamlFilePath: string,
    namespace: string,
  ): Promise<string> {
    const execPromise = promisify(exec);

    // Check if the YAML file exists before deploying
    if (!existsSync(yamlFilePath)) {
      throw new Error(`YAML file not found: ${yamlFilePath}`);
    }

    const quotedYamlFilePath = `"${yamlFilePath}"`; // Handle spaces in paths
    try {
      const { stdout, stderr } = await execPromise(
        `kubectl apply -f ${quotedYamlFilePath} --namespace=${namespace}`,
      );
      if (stderr) {
        this.loggingService.error(
          `Error deploying resource from ${yamlFilePath}: ${stderr}`,
        );
        throw new Error(`Deployment failed: ${stderr.trim()}`);
      }
      this.loggingService.log(
        `Resource deployed from ${yamlFilePath}: ${stdout}`,
      );
      return stdout;
    } catch (error) {
      this.loggingService.error(
        `Failed to deploy resource from ${yamlFilePath}: ${error.message}`,
      );
      throw new Error(`Deployment Error: ${error.message}`);
    }
  }

  /**
   * Check if a deployment exists in the specified namespace.
   * @param deploymentName The name of the deployment.
   * @param namespace The namespace where the deployment should be checked.
   */
  private async deploymentExists(
    deploymentName: string,
    namespace: string,
  ): Promise<boolean> {
    try {
      await this.k8sAppsApi.readNamespacedDeployment(deploymentName, namespace);
      return true; // Deployment exists
    } catch (err) {
      if (err.response && err.response.statusCode === 404) {
        return false; // Deployment does not exist
      }
      this.loggingService.error(
        `Error checking deployment ${deploymentName} in namespace ${namespace}: ${err.message}`,
      );
      throw err;
    }
  }

  /**
   * Log the generated InfluxDB credentials.
   */
  private logInfluxDBCredentials(): void {
    // this.loggingService.log(`InfluxDB URL: ${this.influxdbUrl}`);
    this.loggingService.log(`InfluxDB URL: http://localhost:8086/signin`);
    this.loggingService.log(
      `InfluxDB Admin Username: ${this.influxdbUsername}`,
    );
    this.loggingService.log(
      `InfluxDB Admin Password: ${this.influxdbPassword}`,
    );
    this.loggingService.log(`InfluxDB Admin Token: ${this.influxdbToken}`);
  }
}
