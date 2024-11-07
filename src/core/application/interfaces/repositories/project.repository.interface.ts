import { ProjectSelectType } from 'src/core/domain/models/project';
import { CreateProjectDto } from '../../../presentation/dto/project.dto';

export interface IProjectRepository {
  createProject(
    createProjectDto: CreateProjectDto,
    teamId: string,
    createdBy: string,
    influxDbBucketId: string,
  ): Promise<ProjectSelectType>;

  getProject(projectName: string): Promise<void>;

  deleteProject(projectName: string): Promise<void>;

  getProjects(teamId: string): Promise<ProjectSelectType[]>;
}
