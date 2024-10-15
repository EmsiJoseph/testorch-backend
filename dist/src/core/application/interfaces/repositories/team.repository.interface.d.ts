import { Team } from "../../../domain/models/team";
import { CreateTeamDto } from "../../../presentation/dto/team.dto";
export interface ITeamRepository {
    createTeam(createTeamDto: CreateTeamDto): Promise<Team>;
    getTeam(teamName: string): Promise<void>;
    deleteTeam(teamName: string): Promise<void>;
    getTeams(userId: string): Promise<void>;
}
