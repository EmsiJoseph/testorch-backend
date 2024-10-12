import { IsString, Length, IsOptional } from 'class-validator';

// Define the CreateTeam DTO
export class CreateTeamDto {
  @IsString()
  @Length(3, 31)
  name: string;
}

// Define the UpdateTeam DTO
export class UpdateTeamDto {
  @IsString()
  @Length(3, 31)
  @IsOptional()
  name?: string;
}
