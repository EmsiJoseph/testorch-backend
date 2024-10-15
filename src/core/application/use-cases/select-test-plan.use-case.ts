import { Injectable } from '@nestjs/common';
import { TestPlan } from '../../domain/models/test-plan.entity';
import { TestPlanRepository } from '../../infrastructure/repositories/test-plan/test-plan.repository';

@Injectable()
export class SelectTestPlanUseCase {
  constructor(private readonly testPlanRepo: TestPlanRepository) {}

  async execute(team: string, project: string): Promise<TestPlan[]> {
    return this.testPlanRepo.getTestPlans(team, project);
  }
}

