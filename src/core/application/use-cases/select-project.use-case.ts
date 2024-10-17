import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../../infrastructure/repositories/project/project.repository';

// @Injectable()
// export class SelectProjectUseCase {
//   constructor(private readonly projectRepo: ProjectRepository) {}

//   async execute(team: string, project: string): Promise<any> {
//     return this.projectRepo.getProjects(team, project);
//   }
// }

@Injectable()
export class SelectProjectUseCase {
  constructor(private readonly projectRepo: ProjectRepository) {}

  async execute(team: string, project: string): Promise<any> {
    const projects = await this.projectRepo.getProjects(team, project);

    const modifiedProjects = projects.map((project: any) => ({
      projectName: project.name,
      projectPath: project.path,
      projectID: project.sha,
    }));
    return modifiedProjects;
  }
}