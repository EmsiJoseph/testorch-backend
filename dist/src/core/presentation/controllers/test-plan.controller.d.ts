import { SelectTestPlanUseCase } from '../../../core/application/use-cases/select-test-plan.use-case';
import { DeleteTestPlanUseCase } from '../../../core/application/use-cases/delete-test-plan.use-case';
export declare class TestPlanController {
    private readonly selectTestPlanUseCase;
    private readonly deleteTestPlanUseCase;
    constructor(selectTestPlanUseCase: SelectTestPlanUseCase, deleteTestPlanUseCase: DeleteTestPlanUseCase);
    selectTestPlans(team: string, project: string): Promise<import("../../domain/models/test-plan.entity").TestPlan[]>;
    deleteTestPlan(team: string, project: string, plan: string, sha: string): Promise<any>;
}
