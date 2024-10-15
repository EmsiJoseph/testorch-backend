import { OnModuleInit } from "@nestjs/common";
import { IKubernetesService } from "../../../application/interfaces/services/kubernetes.service.interface";
import { KubernetesClient } from "../../client/kubernetes-client";
import { GrafanaService } from "../grafana/grafana.service";
import { InfluxdbService } from "../influxdb/influxdb.service";
import { JmeterService } from "../jmeter/jmeter.service";
export declare class KubernetesService implements OnModuleInit, IKubernetesService {
    private readonly influxdbService;
    private readonly kubernetesClient;
    private readonly grafanaService;
    private readonly jmeterService;
    private readonly logger;
    constructor(influxdbService: InfluxdbService, kubernetesClient: KubernetesClient, grafanaService: GrafanaService, jmeterService: JmeterService);
    onModuleInit(): Promise<void>;
    initializeDeployments(): Promise<void>;
    createNamespaceIfNotExists(namespace: string): Promise<void>;
    createSecret(secretName: string, namespace: string, secretData: Record<string, string>): Promise<void>;
    getSecret(secretName: string, namespace: string): Promise<any>;
    getDeploymentUrl(serviceName: string, namespace: string, serviceType: "InfluxDB" | "Grafana" | "JMeterMaster" | "JMeterSlave"): Promise<string>;
    deployResourceFromYaml(yamlFilePath: string, namespace: string): Promise<string>;
    deploymentExists(deploymentName: string, namespace: string): Promise<boolean>;
    private isKubernetesHttpError;
    private getErrorMessage;
}
