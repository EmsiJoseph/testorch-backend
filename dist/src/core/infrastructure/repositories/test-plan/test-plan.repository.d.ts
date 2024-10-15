import { GitHubService } from '../../services/github/github.services';
import { TestPlan } from '../../../domain/models/test-plan.entity';
export declare class TestPlanRepository {
    private readonly githubService;
    constructor(githubService: GitHubService);
    getTestPlans(team: string, project: string): Promise<TestPlan[]>;
    deleteTestPlan(team: string, project: string, plan: string, sha: string): Promise<any>;
}
