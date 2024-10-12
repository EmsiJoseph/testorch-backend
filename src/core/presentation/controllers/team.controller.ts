import {Body, Controller, Post, UsePipes, ValidationPipe,} from "@nestjs/common";
import {CreateTeamDto} from "../dto/team.dto";
import {createTeamUseCase} from "../../application/use-cases/create-team.use-case";
import {EventEmitter2} from "@nestjs/event-emitter";
import {TeamRepository} from "../../infrastructure/repositories/team/team.repository";
import {InfluxdbService} from "../../infrastructure/services/influxdb/influxdb.service";

@Controller("team-management")
export class TeamController {
    constructor(private readonly eventEmitter: EventEmitter2,
                private readonly teamRepo: TeamRepository,
                private readonly influxdbService: InfluxdbService) {
    }

    @Post("create-team")
    @UsePipes(new ValidationPipe({transform: true}))
    async createTeam(@Body() createTeamDto: CreateTeamDto) {
        // Authentication and Authorization logic goes here
        return createTeamUseCase(createTeamDto, this.teamRepo, this.influxdbService);
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
