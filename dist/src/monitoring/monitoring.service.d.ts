export declare class MonitoringService {
    private monitoringData;
    monitorHealth(remoteServer: string): Promise<any>;
    sendMetricsToInfluxDB(metrics: any): Promise<any>;
}
