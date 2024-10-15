import { Injectable } from '@nestjs/common';
import { GitHubService } from '../../services/github/github.services';
import { TestPlan } from '../../../domain/models/test-plan.entity';


@Injectable()
export class TestPlanRepository {
  constructor(private readonly githubService: GitHubService) {}

  async getTestPlans(team: string, project: string): Promise<TestPlan[]> {
    return this.githubService.getTestPlans(team, project);
  }

  async deleteTestPlan(team: string, project: string, plan: string, sha: string): Promise<any> {
    return this.githubService.deleteTestPlan(team, project, plan, sha);
  }
}
