export declare class InfluxdbClient {
    private readonly logger;
    private influxdbApi;
    private influxdbToken;
    private influxdbUrl;
    constructor();
    setConfig(url: string, token: string): void;
    orgExists(orgName: string): Promise<boolean>;
    createOrg(orgName: string): Promise<any>;
    getOrgIdByName(orgName: string): Promise<string>;
    createBucket(projectName: string, orgId: string): Promise<any>;
    private handleAxiosError;
}
