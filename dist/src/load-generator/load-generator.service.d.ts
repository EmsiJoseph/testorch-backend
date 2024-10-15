export declare class LoadGeneratorService {
    private loadGenerators;
    spawnLoadGenerator(config: any): Promise<any>;
    terminateLoadGenerator(id: string): Promise<any>;
    executeTestPlan(overriddenPlan: string): Promise<any>;
    getLoadGeneratorStatus(): Promise<any>;
}
