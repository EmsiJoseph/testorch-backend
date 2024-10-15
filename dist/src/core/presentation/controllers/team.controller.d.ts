import { CreateTeamDto } from "../dto/team.dto";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { TeamRepository } from "../../infrastructure/repositories/team/team.repository";
import { InfluxdbService } from "../../infrastructure/services/influxdb/influxdb.service";
export declare class TeamController {
    private readonly eventEmitter;
    private readonly teamRepo;
    private readonly influxdbService;
    constructor(eventEmitter: EventEmitter2, teamRepo: TeamRepository, influxdbService: InfluxdbService);
    createTeam(createTeamDto: CreateTeamDto): Promise<{
        message: string;
        teamName: string;
    }>;
}
