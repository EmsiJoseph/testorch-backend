import { ProjectRepository } from '../../infrastructure/repositories/project/project.repository';
export declare class DeleteProjectUseCase {
    private readonly projectRepo;
    constructor(projectRepo: ProjectRepository);
    execute(team: string, project: string, sha: string): Promise<any>;
}
