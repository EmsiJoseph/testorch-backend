import { Injectable, Logger } from "@nestjs/common";
import * as path from "path";

import { UtilsService } from "../utils/utils.service";

@Injectable()
export class GrafanaService {
  private readonly logger = new Logger(GrafanaService.name);

  public grafanaUrl: string;
  public grafanaUsername: string;
  public grafanaPassword: string;

  constructor(private readonly utilsService: UtilsService) {}

  async createGrafanaSecret(namespace: string): Promise<void> {
    const secretName = "grafana-env-secrets";
    this.grafanaUsername = "admin";
    this.grafanaPassword = this.utilsService.generateStrongPassword();

    const secretData = {
      GF_SECURITY_ADMIN_USER: this.grafanaUsername,
      GF_SECURITY_ADMIN_PASSWORD: this.grafanaPassword,
    };
    await this.utilsService.createSecret(secretName, namespace, secretData);
  }

  public async deployGrafanaIfNotExists(): Promise<string> {
    const grafanaYaml = path.join(
      process.cwd(),
      "src",
      "kubernetes-management",
      "kubernetes",
      "grafana-deployment.yaml",
    );
    const namespace = "monitoring";
    const deploymentName = "grafana";
    await this.createGrafanaSecret(namespace);

    if (await this.utilsService.deploymentExists(deploymentName, namespace)) {
      this.logger.log(
        "Grafana deployment already exists, skipping deployment.",
      );
      this.grafanaUrl = await this.utilsService.getDeploymentUrl(
        deploymentName,
        namespace,
        "Grafana",
      );
      return "Grafana already deployed";
    }

    await this.utilsService.deployResourceFromYaml(grafanaYaml, namespace);
    this.grafanaUrl = await this.utilsService.getDeploymentUrl(
      deploymentName,
      namespace,
      "Grafana",
    );
    return "Grafana deployed";
  }
}
