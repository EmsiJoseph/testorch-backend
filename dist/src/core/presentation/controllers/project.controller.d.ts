import { SelectProjectUseCase } from '../../../core/application/use-cases/select-project.use-case';
import { DeleteProjectUseCase } from '../../../core/application/use-cases/delete-project.use-case';
export declare class ProjectController {
    private readonly selectProjectUseCase;
    private readonly deleteProjectUseCase;
    constructor(selectProjectUseCase: SelectProjectUseCase, deleteProjectUseCase: DeleteProjectUseCase);
    selectProject(team: string, project: string): Promise<any>;
    deleteProject(team: string, project: string, sha: string): Promise<any>;
}
