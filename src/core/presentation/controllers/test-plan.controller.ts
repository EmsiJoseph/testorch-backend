import { Controller, Get, Delete, Param } from '@nestjs/common';
import { SelectTestPlanUseCase } from '../../../core/application/use-cases/select-test-plan.use-case';
import { DeleteTestPlanUseCase } from '../../../core/application/use-cases/delete-test-plan.use-case';

@Controller('test-plan')  
export class TestPlanController {
  constructor(
    private readonly selectTestPlanUseCase: SelectTestPlanUseCase,
    private readonly deleteTestPlanUseCase: DeleteTestPlanUseCase,
  ) {
     console.log('⭐ TestPlanController initialized');
  }


  @Get('select/:team/:project')  
  async selectTestPlans(@Param('team') team: string, @Param('project') project: string) {
    return this.selectTestPlanUseCase.execute(team, project);
  }

  @Delete('delete/:team/:project/:plan/:sha') 
  async deleteTestPlan(
    @Param('team') team: string,
    @Param('project') project: string,
    @Param('plan') plan: string,
    @Param('sha') sha: string,
  ) {
    return this.deleteTestPlanUseCase.execute(team, project, plan, sha);
  }
}
