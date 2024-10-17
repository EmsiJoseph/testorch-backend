import { ProjectRepository } from '../../infrastructure/repositories/project/project.repository';
export declare class SelectProjectUseCase {
    private readonly projectRepo;
    constructor(projectRepo: ProjectRepository);
    execute(team: string, project: string): Promise<any>;
}
