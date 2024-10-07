import { Injectable, Logger } from "@nestjs/common";
import * as k8s from "@kubernetes/client-node";

@Injectable()
export class KubernetesClientService {
  private readonly logger = new Logger(KubernetesClientService.name);

  public kubeConfig: k8s.KubeConfig;
  public k8sCoreApi: k8s.CoreV1Api;
  public k8sAppsApi: k8s.AppsV1Api;

  constructor() {
    this.initializeKubernetesClients();
  }

  private initializeKubernetesClients(): void {
    this.kubeConfig = new k8s.KubeConfig();

    const useInCluster = process.env.USE_IN_CLUSTER === "true";

    if (useInCluster) {
      this.kubeConfig.loadFromCluster();
      this.logger.log("Using in-cluster Kubernetes configuration.");
    } else {
      this.kubeConfig.loadFromDefault();
    }

    // Initialize the Kubernetes API clients
    this.k8sCoreApi = this.kubeConfig.makeApiClient(k8s.CoreV1Api);
    this.k8sAppsApi = this.kubeConfig.makeApiClient(k8s.AppsV1Api);
  }
}
