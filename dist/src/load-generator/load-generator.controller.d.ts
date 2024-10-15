import { LoadGeneratorService } from "./load-generator.service";
export declare class LoadGeneratorController {
    private readonly loadGeneratorService;
    constructor(loadGeneratorService: LoadGeneratorService);
    spawnLoadGenerator(config: any): Promise<any>;
    terminateLoadGenerator(id: string): Promise<any>;
    getStatus(): Promise<any>;
}
