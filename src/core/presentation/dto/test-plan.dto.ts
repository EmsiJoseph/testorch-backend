import { IsString, Length } from 'class-validator';

export class UploadPlanDto {
  file: string;
  fileName: string;
}

export class AddTestPlanDto {
  @IsString()
  @Length(3, 31)
  name: string;

  fileName: string;

  email: string;

  projectId: string;
}

export class GetTestPlansDto {
  projectId: string;
}