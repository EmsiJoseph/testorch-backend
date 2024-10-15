import { HttpService } from '@nestjs/axios';
export declare class GitHubService {
    private readonly httpService;
    private readonly githubApiUrl;
    private readonly owner;
    private readonly repo;
    private readonly token;
    constructor(httpService: HttpService);
    getTestPlans(team: string, project: string): Promise<any>;
    deleteTestPlan(team: string, project: string, plan: string, sha: string): Promise<any>;
}
