import { ITeamRepository } from "../../../application/interfaces/repositories/team.repository.interface";
import { Team } from "../../../domain/models/team";
import { CreateTeamDto } from "../../../presentation/dto/team.dto";
export declare class TeamRepository implements ITeamRepository {
    private readonly logger;
    createTeam(createTeamDto: CreateTeamDto): Promise<Team>;
    getTeam(teamName: string): Promise<void>;
    deleteTeam(teamName: string): Promise<void>;
    getTeams(userId: string): Promise<void>;
}
