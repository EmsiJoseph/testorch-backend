import { Inject, Injectable, Logger } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { IProjectRepository } from 'src/core/application/interfaces/repositories/project.repository.interface';
import {
    ProjectInsertType,
    ProjectSelectType,
} from 'src/core/domain/models/project';
import { DRIZZLE_ORM } from '../../../../constants/db.constant';
import { DatabaseOperationError } from '../../../domain/errors/common';
import * as schema from '../../database/schema';
import { projects } from '../../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ProjectRepository implements IProjectRepository {
  private readonly logger = new Logger(ProjectRepository.name);

  constructor(
    @Inject(DRIZZLE_ORM) private conn: PostgresJsDatabase<typeof schema>,
  ) {}

  async createProject(
    createProjectDto: ProjectInsertType,
    teamId: string,
    createdBy: string, // Add createdBy parameter
    influxDbBucketId: string,
  ): Promise<ProjectSelectType> {
    try {
      const query = this.conn
        .insert(projects)
        .values({
          name: createProjectDto.name,
          influxDb_bucket_id: influxDbBucketId,
          team_id: teamId,
          created_by: createdBy, // Include created_by
        })
        .returning();

      const [createdProject] = await query.execute();

      if (!createdProject) {
        throw new Error('Failed to create project');
      }

      return createdProject;
    } catch (error) {
      this.logger.error('Error creating project:', error);
      throw new DatabaseOperationError('Failed to create project', error);
    }
  }

  // Placeholder methods for other CRUD operations
  async getProject(projectName: string): Promise<void> {
    console.log(`Getting project ${projectName}`);
  }

  async deleteProject(projectName: string): Promise<void> {
    console.log(`Deleting project ${projectName}`);
  }

  async getProjects(teamId: string): Promise<ProjectSelectType[]> {
    try {
      const query = this.conn
        .select()
        .from(projects)
        .where(eq(projects.team_id, teamId));

      const projectList = await query.execute();

      return projectList;
    } catch (error) {
      this.logger.error('Error fetching projects:', error);
      throw new DatabaseOperationError('Failed to fetch projects', error);
    }
  }
}
