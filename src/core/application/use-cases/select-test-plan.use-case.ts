import { Injectable } from '@nestjs/common';
import { TestPlan } from '../../domain/models/test-plan.entity';
import { TestPlanRepository } from '../../infrastructure/repositories/test-plan/test-plan.repository';

// @Injectable()
// export class SelectTestPlanUseCase {
//   constructor(private readonly testPlanRepo: TestPlanRepository) {}

//   async execute(team: string, project: string): Promise<TestPlan[]> {
//     return this.testPlanRepo.getTestPlans(team, project);
//   }
// }

@Injectable()
export class SelectTestPlanUseCase {
  constructor(private readonly testPlanRepo: TestPlanRepository){}

  async execute(team: string, project: string): Promise<any> {
    const testplans = await this.testPlanRepo.getTestPlans(team, project);

    const modifiedTestPlans = testplans.map((project: any) => ({
      testplanName: project.name,
      testplanPath: project.path,
      testplanSize: project.size,
      testplanID: project.sha, 
    }));
    return modifiedTestPlans;
  }
}
