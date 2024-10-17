import { HttpService } from '@nestjs/axios';
export declare class ProjectRepository {
    private readonly httpService;
    private readonly githubApiUrl;
    private readonly token;
    constructor(httpService: HttpService);
    getProjects(team: string, project: string): Promise<any>;
    deleteProject(team: string, project: string, sha: string): Promise<any>;
    deleteFile(path: string, sha: string): Promise<any>;
}
