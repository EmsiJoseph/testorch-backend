import { ConfigService } from '@nestjs/config';
import { TeamSelectType } from 'src/core/domain/models/team';
import { SetupService } from 'src/core/infrastructure/services/setup.service';
import { CreateTeamDto } from '../../presentation/dto/team.dto';
import { ITeamRepository } from '../interfaces/repositories/team.repository.interface';
import { IUsersRepository } from '../interfaces/repositories/users.repository.interface';
import { IInfluxdbService } from '../interfaces/services/influxdb.service.interface';

/**
 * Function to create a team.
 * @param createTeamDto - The name of the team to be created.
 * @param teamRepo - The repository to handle team data.
 * @param influxdbService - The service to handle InfluxDB operations.
 * @param userId
 * @returns The result of the team creation process.
 */
export async function createTeamUseCase(
  createTeamDto: CreateTeamDto,
  teamRepo: ITeamRepository,
  influxdbService: IInfluxdbService,
  userRepo: IUsersRepository,
  setupService: SetupService,
  configService: ConfigService,
): Promise<TeamSelectType> {
  const user = await userRepo.getUserByEmail(createTeamDto.email);
  if (!user) {
    throw new Error('User not found');
  }

  const influxDbCredentials = await setupService.getInfluxDbCredentials();

  const influxDbUrl = configService.get<string>('INFLUXDB_URL');

  if (!influxDbUrl || !influxDbCredentials) {
    throw new Error('InfluxDB credentials not found');
  }

  const crdentials = {
    token: influxDbCredentials.token,
    url: influxDbUrl,
  }

  // Create an InfluxDB organization for the team
  const { id } = await influxdbService.createInfluxdbOrg(
    createTeamDto.name,
    crdentials
  );

  // Create the team in the team repository
  return await teamRepo.createTeam(createTeamDto, id, user.id);
}
