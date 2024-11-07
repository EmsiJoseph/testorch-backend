import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UsersRepository } from 'src/core/infrastructure/repositories/users/users.repository';
import { AuthorizationGuard } from '../../../foundation/guards/authorization.guard';
import { createTeamUseCase } from '../../application/use-cases/create-team.use-case';
import { TeamRepository } from '../../infrastructure/repositories/team/team.repository';
import { InfluxdbService } from '../../infrastructure/services/influxdb/influxdb.service';
import { CreateTeamDto } from '../dto/team.dto';

@Controller('team-management')
export class TeamController {
  constructor(
    private readonly teamRepo: TeamRepository,
    private readonly influxdbService: InfluxdbService,
    private readonly userRepo: UsersRepository,
  ) {}

  @UseGuards(AuthorizationGuard)
  @Post('create-team')
  async createTeam(@Body() createTeamDto: CreateTeamDto) {
    const result = await createTeamUseCase(
      createTeamDto,
      this.teamRepo,
      this.influxdbService,
      this.userRepo,
    );
    return { message: 'Team created successfully', data: result };
  }

  // @Patch("update-team/:id")
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async updateTeam(
  //   @Param("id") teamId: string,
  //   @Body() updateTeamDto: UpdateTeamDto,
  // ) {
  //   return this.teamManagementService.updateTeam(teamId, updateTeamDto);
  // }
}
