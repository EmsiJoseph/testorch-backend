import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../../infrastructure/repositories/project/project.repository';

@Injectable()
export class DeleteProjectUseCase {
  constructor(private readonly projectRepo: ProjectRepository) {}

  async execute(team: string, project: string, sha: string): Promise<any> {
    return this.projectRepo.deleteProject(team, project, sha);
  }
}