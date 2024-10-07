import { Injectable, Logger } from "@nestjs/common";
import * as path from "path";

import { UtilsService } from "../utils/utils.service";

@Injectable()
export class JmeterService {
  private readonly logger = new Logger(JmeterService.name);
  constructor(private readonly utilsService: UtilsService) {}
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
    if (await this.utilsService.deploymentExists("jmeter-master", namespace)) {
      this.logger.log(
        "JMeter Master deployment already exists, skipping deployment.",
      );
      return "JMeter Master already deployed";
    }

    return this.utilsService.deployResourceFromYaml(
      jmeterMasterYaml,
      namespace,
    );
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
    if (await this.utilsService.deploymentExists("jmeter-slave", namespace)) {
      this.logger.log(
        "JMeter Slaves deployment already exists, skipping deployment.",
      );
      return "JMeter Slaves already deployed";
    }

    return this.utilsService.deployResourceFromYaml(jmeterSlaveYaml, namespace);
  }
}
