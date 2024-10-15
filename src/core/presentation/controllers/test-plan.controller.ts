import { Controller, Get, Delete, Param } from '@nestjs/common';
import { SelectTestPlanUseCase } from '../../../core/application/use-cases/select-test-plan.use-case';
import { DeleteTestPlanUseCase } from '../../../core/application/use-cases/delete-test-plan.use-case';

@Controller('test-plan')  // This sets the base route to /test-plan
export class TestPlanController {
  constructor(
    private readonly selectTestPlanUseCase: SelectTestPlanUseCase,
    private readonly deleteTestPlanUseCase: DeleteTestPlanUseCase,
  ) {
    console.log('TestPlanController initialized');
  }

  // Select Test Plans (GET)
  @Get('select/:team/:project')  // This defines the full route as /test-plan/select/:team/:project
  async selectTestPlans(@Param('team') team: string, @Param('project') project: string) {
    return this.selectTestPlanUseCase.execute(team, project);
  }

  // Delete a Test Plan (DELETE)
  @Delete('delete/:team/:project/:plan/:sha')  // Full route: /test-plan/delete/:team/:project/:plan/:sha
  async deleteTestPlan(
    @Param('team') team: string,
    @Param('project') project: string,
    @Param('plan') plan: string,
    @Param('sha') sha: string,
  ) {
    return this.deleteTestPlanUseCase.execute(team, project, plan, sha);
  }
}
