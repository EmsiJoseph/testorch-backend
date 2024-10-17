import { TestPlanRepository } from '../../infrastructure/repositories/test-plan/test-plan.repository';
export declare class SelectTestPlanUseCase {
    private readonly testPlanRepo;
    constructor(testPlanRepo: TestPlanRepository);
    execute(team: string, project: string): Promise<any>;
}
