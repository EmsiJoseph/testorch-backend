import { Injectable, OnModuleInit, Logger } from "@nestjs/common";

import { InfluxdbService } from "../influxdb/influxdb.service";
import { GrafanaService } from "../grafana/grafana.service";
import { KubernetesClientService } from "./kubernetes-client.service";
import { JmeterService } from "../jmeter/jmeter.service";

@Injectable()
export class KubernetesManagementService implements OnModuleInit {
  private readonly logger = new Logger(KubernetesManagementService.name);
  constructor(
    private readonly influxdbService: InfluxdbService,
    private readonly grafanaService: GrafanaService,
    private readonly jmeterService: JmeterService,
    private readonly kubernetesClientService: KubernetesClientService,
  ) {}

  async onModuleInit() {
    this.logger.log(
      "Initializing Kubernetes namespaces and deployments...",
    );
    const namespaces = ["perf-platform", "monitoring"];
    for (const namespace of namespaces) {
      await this.createNamespaceIfNotExists(namespace);
    }
    await this.influxdbService.deployInfluxDBIfNotExists();
    await this.grafanaService.deployGrafanaIfNotExists();
    await this.jmeterService.deployJmeterMasterIfNotExists();
    await this.jmeterService.deployJmeterSlavesIfNotExists();

    // Log the InfluxDB and Grafana URLs after deploying only if first deployment
    if (this.influxdbService.isFirstDeployment) {
      this.logServiceUrls();
    }
  }

  async createNamespaceIfNotExists(namespace: string): Promise<void> {
    try {
      await this.kubernetesClientService.k8sCoreApi.readNamespace(namespace);
      this.logger.log(
        `Namespace ${namespace} already exists, skipping creation.`,
      );
    } catch (err) {
      if (err.response && err.response.statusCode === 404) {
        this.logger.log(`Creating namespace ${namespace}...`);
        await this.kubernetesClientService.k8sCoreApi.createNamespace({
          metadata: { name: namespace },
        });
        this.logger.log(`Namespace ${namespace} created.`);
      } else {
        this.logger.error(
          `Error checking/creating namespace: ${err.message}`,
        );
        throw err;
      }
    }
  }

  private logServiceUrls(): void {
    this.logger.log(
      `InfluxDB URL: ${this.influxdbService.influxdbUrl}`,
    );
    this.logger.log(
      `InfluxDB Admin Username: ${this.influxdbService.influxdbUsername}`,
    );
    this.logger.log(
      `InfluxDB Admin Password: ${this.influxdbService.influxdbPassword}`,
    );
    this.logger.log(
      `InfluxDB Admin Token: ${this.influxdbService.influxdbToken}`,
    );

    this.logger.log(`Grafana URL: ${this.grafanaService.grafanaUrl}`);
    this.logger.log(
      `Grafana Admin Username: ${this.grafanaService.grafanaUsername}`,
    );
    this.logger.log(
      `Grafana Admin Password: ${this.grafanaService.grafanaPassword}`,
    );
  }
}
