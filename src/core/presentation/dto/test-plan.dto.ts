export class UploadPlanDto {
  file: string;
  fileName: string;
}

export class AddTestPlanDto {
  name: string;

  description?: string;
  
  file: string;

  fileName: string;

  email: string;

  projectName: string;

  type: string;
}

export class GetTestPlansDto {
  projectId: string;
}

export class AddTestPlanV2Dto {
  name: string;

  description?: string;
  
  file: string;

  fileName: string;

  email: string;

  projectName: string;

  type: string;

  auth0_org_id: string;

}