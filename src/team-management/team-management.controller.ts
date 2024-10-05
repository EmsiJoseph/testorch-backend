import {
  Body,
  Controller,
  Post,
  Patch,
  Param,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { TeamManagementService } from "./team-management.service";
import { CreateTeamDto, UpdateTeamDto } from "./team-management.dto";

@Controller("team-management")
export class TeamManagementController {
  constructor(private readonly teamManagementService: TeamManagementService) {}

  @Post("create-team")
  @UsePipes(new ValidationPipe({ transform: true }))
  async createTeam(@Body() createTeamDto: CreateTeamDto) {
    return this.teamManagementService.createTeam(createTeamDto.name);
  }

  @Patch("update-team/:id")
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateTeam(
    @Param("id") teamId: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamManagementService.updateTeam(teamId, updateTeamDto);
  }
}
