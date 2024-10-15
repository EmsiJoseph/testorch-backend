import * as k8s from "@kubernetes/client-node";
import { IKubernetesClient } from "../../application/interfaces/client/kubernetes-client.interface";
export declare class KubernetesClient implements IKubernetesClient {
    private readonly logger;
    k8sCoreApi: k8s.CoreV1Api;
    k8sRbacApi: k8s.RbacAuthorizationV1Api;
    k8sAppsApi: k8s.AppsV1Api;
    constructor();
    createNamespace(namespace: string): Promise<void>;
    createSecret(namespace: string, secretManifest: k8s.V1Secret): Promise<void>;
    getSecret(namespace: string, secretName: string): Promise<k8s.V1Secret>;
    createRole(namespace: string, roleManifest: k8s.V1Role): Promise<void>;
    createRoleBinding(namespace: string, roleBindingManifest: k8s.V1RoleBinding): Promise<void>;
    namespaceExists(namespace: string): Promise<boolean>;
    deploymentExists(deploymentName: string, namespace: string): Promise<boolean>;
    getServiceUrl(serviceName: string, namespace: string, serviceType: "InfluxDB" | "Grafana" | "JMeterMaster" | "JMeterSlave"): Promise<string>;
    private isKubernetesError;
    private handleKubernetesError;
}
