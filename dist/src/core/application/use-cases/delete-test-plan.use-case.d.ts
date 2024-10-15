import { TestPlanRepository } from '../../infrastructure/repositories/test-plan/test-plan.repository';
export declare class DeleteTestPlanUseCase {
    private readonly testPlanRepo;
    constructor(testPlanRepo: TestPlanRepository);
    execute(team: string, project: string, plan: string, sha: string): Promise<any>;
}
