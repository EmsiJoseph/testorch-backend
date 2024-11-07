import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { getProjectsUseCase } from 'src/core/application/use-cases/get-projects.use-case';
import { TeamRepository } from 'src/core/infrastructure/repositories/team/team.repository';
import { TestPlanRepositoryV2 } from 'src/core/infrastructure/repositories/test-plan/test-plan.repository-v2';
import { UsersRepository } from 'src/core/infrastructure/repositories/users/users.repository';
import { AuthorizationGuard } from '../../../foundation/guards/authorization.guard';
import { createProjectUseCase } from '../../application/use-cases/create-project.use-case';
import { ProjectRepository } from '../../infrastructure/repositories/project/project.repository';
import { InfluxdbService } from '../../infrastructure/services/influxdb/influxdb.service';
import { CreateProjectDto } from '../dto/project.dto';

@Controller('project-management')
export class ProjectController {
  constructor(
    private readonly projectRepo: ProjectRepository,
    private readonly influxdbService: InfluxdbService,
    private readonly teamRepo: TeamRepository,
    private readonly userRepo: UsersRepository,
    private readonly testPlanRepo: TestPlanRepositoryV2,
  ) {}

  @UseGuards(AuthorizationGuard)
  @Post('create-project')
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    const result = await createProjectUseCase(
      createProjectDto,
      this.projectRepo,
      this.influxdbService,
      this.teamRepo,
      this.userRepo,
    );
    return { message: 'Project created successfully', data: result };
  }

  @UseGuards(AuthorizationGuard)
  @Get('get-projects/:auth0OrgId')
  async getProjects(@Param('auth0OrgId') auth0OrgId: string) {
    const result = await getProjectsUseCase(
      auth0OrgId,
      this.teamRepo,
      this.projectRepo,
      this.userRepo,
      this.testPlanRepo,
    );
    return { message: 'Projects fetched successfully', data: result };
  }
}
