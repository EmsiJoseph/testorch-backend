import {Injectable, Logger} from "@nestjs/common";
import {ITeamRepository} from "../../../application/interfaces/repositories/team.repository.interface";
import {Team} from "../../../domain/models/team";
import {CreateTeamDto} from "../../../presentation/dto/team.dto";

@Injectable()
export class TeamRepository implements ITeamRepository {
    private readonly logger = new Logger(TeamRepository.name);

    async createTeam(
        createTeamDto: CreateTeamDto,
    ): Promise<Team> {
        this.logger.log(`Creating team ${createTeamDto.name}`);
        // Communicating with the database
        // Storing the team in the database
        this.logger.log(`Stored team ${createTeamDto.name} in database`);
        return {name: createTeamDto.name};
        // throw new DatabaseOperationError("Cannot create team");
    }

    async getTeam(teamName: string): Promise<void> {
        console.log(`Getting team ${teamName}`);
    }

    async deleteTeam(teamName: string): Promise<void> {
        console.log(`Deleting team ${teamName}`);
    }

    async getTeams(userId: string): Promise<void> {
        console.log(`Getting teams for user ${userId}`);
    }
}
