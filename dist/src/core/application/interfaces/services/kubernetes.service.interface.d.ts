export interface IKubernetesService {
    onModuleInit(): Promise<void>;
    createSecret(secretName: string, namespace: string, secretData: Record<string, string>, serviceAccountName: string): Promise<void>;
    getSecret(secretName: string, namespace: string): Promise<Record<string, string>>;
    getDeploymentUrl(serviceName: string, namespace: string, serviceType: "InfluxDB" | "Grafana" | "JMeterMaster" | "JMeterSlave"): Promise<string>;
    deploymentExists(deploymentName: string, namespace: string): Promise<boolean>;
    deployResourceFromYaml(yamlFilePath: string, namespace: string): Promise<string>;
}
