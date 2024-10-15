import { OnModuleInit } from "@nestjs/common";
import { IGrafanaService } from "../../../application/interfaces/services/grafana.service.interface";
import { KubernetesService } from "../kubernetes/kubernetes.service";
export declare class GrafanaService implements IGrafanaService, OnModuleInit {
    private readonly kubernetesService;
    private readonly logger;
    private grafanaUrl;
    private grafanaUsername;
    private grafanaPassword;
    private namespace;
    constructor(kubernetesService: KubernetesService);
    onModuleInit(): void;
    createGrafanaSecret(namespace: string): Promise<void>;
    deployGrafanaIfNotExists(): Promise<string>;
    createDatasource(data: any): Promise<any>;
    getDatasource(name: string): Promise<any>;
    deleteDatasource(id: number): Promise<any>;
    listDashboards(): Promise<any>;
    createDashboard(dashboard: any): Promise<any>;
    getDashboard(name: string): Promise<any>;
    deleteDashboard(id: number): Promise<any>;
}
