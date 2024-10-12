import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import * as path from "path";
import { OnEvent } from "@nestjs/event-emitter";

import { IJmeterService } from "../../../application/interfaces/services/jmeter.service.interface";
import { KubernetesService } from "../kubernetes/kubernetes.service";

@Injectable()
export class JmeterService implements IJmeterService {
  private readonly logger = new Logger(JmeterService.name);
  private namespace: string = "perf-platform";
  constructor(
    @Inject(forwardRef(() => KubernetesService))
    private readonly kubernetesService: KubernetesService,
  ) {}
  /**
   * Deploy JMeter Master using the YAML file if not already deployed.
   */
  @OnEvent("kubernetes.init", { async: true })
  async deployJmeterMasterIfNotExists(): Promise<string> {
    this.logger.log(
      "Received 'kubernetes.init' event, deploying Jmeter Master...",
    );
    const jmeterMasterYaml = path.join(
      process.cwd(),
      "src",
      "static",
      "deployments",
      "jmeter-master-deployment.yaml",
    );

    const namespace = this.namespace;

    // Check if JMeter Master deployment already exists
    if (
      await this.kubernetesService.deploymentExists("jmeter-master", namespace)
    ) {
      this.logger.log(
        "JMeter Master deployment already exists, skipping deployment.",
      );
      return "JMeter Master already deployed";
    }

    await this.kubernetesService.deployResourceFromYaml(
      jmeterMasterYaml,
      namespace,
    );

    return "JMeter Master deployed";
  }

  /**
   * Deploy JMeter Slaves using the YAML file if not already deployed.
   */
  @OnEvent("kubernetes.init", { async: true })
  async deployJmeterSlavesIfNotExists(): Promise<string> {
    this.logger.log(
      "Received 'kubernetes.init' event, deploying Jmeter Slaves...",
    );
    const jmeterSlaveYaml = path.join(
      process.cwd(),
      "src",
      "static",
      "deployments",
      "jmeter-slave-deployment.yaml",
    );

    const namespace = this.namespace;

    // Check if JMeter Slaves deployment already exists
    if (
      await this.kubernetesService.deploymentExists("jmeter-slave", namespace)
    ) {
      this.logger.log(
        "JMeter Slaves deployment already exists, skipping deployment.",
      );
      return "JMeter Slaves already deployed";
    }

    await this.kubernetesService.deployResourceFromYaml(
      jmeterSlaveYaml,
      namespace,
    );
    return "JMeter Slaves deployed";
  }
}
