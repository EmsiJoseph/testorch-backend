import { Body, Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from 'src/core/infrastructure/repositories/users/users.repository';
import { SetupService } from 'src/core/infrastructure/services/setup.service';
import { AuthorizationGuard } from '../../../foundation/guards/authorization.guard';
import { createTeamUseCase } from '../../application/use-cases/create-team.use-case';
import { TeamRepository } from '../../infrastructure/repositories/team/team.repository';
import { InfluxdbService } from '../../infrastructure/services/influxdb/influxdb.service';
import { CreateTeamDto } from '../dto/team.dto';
import { RecentActivitiesRepository } from '../../infrastructure/repositories/activities/RecentActivitiesRepository';

@Controller('team-management')
export class TeamController {
  constructor(
    private readonly teamRepo: TeamRepository,
    private readonly influxdbService: InfluxdbService,
    private readonly userRepo: UsersRepository,
    private readonly setupService: SetupService,
    private readonly configService: ConfigService,
    private readonly recentActivitiesRepo: RecentActivitiesRepository, // Added recent activities repo
  ) {}

  @UseGuards(AuthorizationGuard)
  @Post('create-team')
  async createTeam(@Body() createTeamDto: CreateTeamDto) {
    // Step 1: Create the team
    const result = await createTeamUseCase(
      createTeamDto,
      this.teamRepo,
      this.influxdbService,
      this.userRepo,
      this.setupService,
      this.configService,
    );

    await this.recentActivitiesRepo.createRecentActivity({
      email: createTeamDto.email, 
      activity_name: 'Created a Team',
      team_name: createTeamDto.name,
      auth0_org_id: createTeamDto.auth0_org_id,
      project_name: 'N/A',
      activity_type: 'create',
    });

    return { message: 'Team created successfully', data: result };
  }

  // Endpoint to log team activities
  // @UseGuards(AuthorizationGuard)
  @Post('log-activity')
  async logActivity(@Body() activityData: any) {
    await this.recentActivitiesRepo.createRecentActivity(activityData);
    return { message: 'Activity logged successfully' };
  }

  // Endpoint to get recent activities by team name
  // @UseGuards(AuthorizationGuard)
  @Get('recent-activity/:teamName')
  async getRecentActivities(@Param('teamName') teamName: string) {
    const activities = await this.recentActivitiesRepo.getRecentActivitiesByTeam(teamName);
    return activities;
  }
}
