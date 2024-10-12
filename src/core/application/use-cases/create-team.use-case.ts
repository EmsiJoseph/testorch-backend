import {IInfluxdbService} from "../interfaces/services/influxdb.service.interface";
import {ITeamRepository} from "../interfaces/repositories/team.repository.interface";
import {CreateTeamDto} from "../../presentation/dto/team.dto";

// TODO: Use drizzle type
// interface IUser {
//   id: string;
//   roles: string[];
// }

/**
 * Function to create a team.
 * @param createTeamDto - The name of the team to be created.
 * @param teamRepo - The repository to handle team data.
 * @param influxdbService - The service to handle InfluxDB operations.
 * @returns The result of the team creation process.
 */
export async function createTeamUseCase(
    createTeamDto: CreateTeamDto,
    teamRepo: ITeamRepository,
    influxdbService: IInfluxdbService
): Promise<{ message: string; teamName: string }> {
    // Create the team in the team repository
    const createdTeam = await teamRepo.createTeam(createTeamDto);

    // Create an InfluxDB organization for the team
    await influxdbService.createInfluxdbOrg(createdTeam);

    // Return success message and team name
    return {
        message: "Team and corresponding InfluxDB organization created successfully",
        teamName: createTeamDto.name,
    };
}
