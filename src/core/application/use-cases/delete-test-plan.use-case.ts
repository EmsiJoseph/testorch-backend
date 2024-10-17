import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { TestPlanRepository } from '../../infrastructure/repositories/test-plan/test-plan.repository';

@Injectable()
export class DeleteTestPlanUseCase {
  constructor(private readonly testPlanRepo: TestPlanRepository) {}

  async execute(team: string, project: string, plan: string, sha: string): Promise<any> {
    console.log(`Deleting Test Plan - Team: ${team}, Project: ${project}, Plan: ${plan}, SHA: ${sha}`);

    if (!team || !project || !plan || !sha) {
      throw new HttpException('Invalid input parameters', HttpStatus.BAD_REQUEST);
    }

    try {
      const response = await this.testPlanRepo.deleteTestPlan(team, project, plan, sha);
      console.log('Delete Test Plan Response:', response);
      return response;
    } catch (error) {
      console.error('Error Deleting Test Plan:', error);
      throw new HttpException('Failed to Delete Test Plan from Repository', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
