import { IInfluxdbService } from "../interfaces/services/influxdb.service.interface";
import { ITeamRepository } from "../interfaces/repositories/team.repository.interface";
import { CreateTeamDto } from "../../presentation/dto/team.dto";
export declare function createTeamUseCase(createTeamDto: CreateTeamDto, teamRepo: ITeamRepository, influxdbService: IInfluxdbService): Promise<{
    message: string;
    teamName: string;
}>;
