import { IsString, Length, IsOptional } from "class-validator";

export class CreateProjectDto {
    @IsString()
    @Length(3, 31)
    name: string;
  
    @IsString()
    @IsOptional()
    description?: string;
  
    auth0_org_id: string;
  
    email: string;
}
