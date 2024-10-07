import {Injectable, Logger} from "@nestjs/common";
import * as path from "path";

import { UtilsService } from "../utils/utils.service";

@Injectable()
export class InfluxdbService {
  private readonly logger = new Logger(InfluxdbService.name);
  public influxdbUrl: string;
  public influxdbUsername: string;
  public influxdbPassword: string;
  public influxdbToken: string;

  public isFirstDeployment: boolean;

  constructor(
    private readonly utilsService: UtilsService,
  ) {}

  async createInfluxDBSecret(namespace: string): Promise<void> {
    const secretName = "influxdb-env-secrets";
    this.influxdbUsername = "admin";
    this.influxdbPassword = this.utilsService.generateStrongPassword();
    this.influxdbToken = this.utilsService.generateToken();

    const secretData = {
      INFLUXDB_INIT_USERNAME: this.influxdbUsername,
      INFLUXDB_INIT_PASSWORD: this.influxdbPassword,
      INFLUXDB_INIT_ADMIN_TOKEN: this.influxdbToken,
      INFLUXDB_INIT_ORG: "perf-platform",
      INFLUXDB_INIT_BUCKET: "perf-bucket",
    };
    await this.utilsService.createSecret(secretName, namespace, secretData);
  }

  public async deployInfluxDBIfNotExists(): Promise<string> {
    const influxdbYaml = path.join(
      process.cwd(),
      "src",
      "kubernetes-management",
      "kubernetes",
      "influxdb-deployment.yaml",
    );
    const namespace = "monitoring";
    await this.createInfluxDBSecret(namespace);

    if (await this.utilsService.deploymentExists("influxdb", namespace)) {
      this.logger.log(
        "InfluxDB deployment already exists, skipping deployment.",
      );
      this.influxdbUrl = await this.utilsService.getDeploymentUrl(
        "influxdb",
        namespace,
        "InfluxDB",
      );
      return "InfluxDB already deployed";
    }

    await this.utilsService.deployResourceFromYaml(influxdbYaml, namespace);
    this.isFirstDeployment = true;
    this.influxdbUrl = await this.utilsService.getDeploymentUrl(
      "influxdb",
      namespace,
      "InfluxDB",
    );
    return "InfluxDB deployed";
  }
}
