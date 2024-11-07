import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { addTestPlanUseCase } from 'src/core/application/use-cases/add-test-plan.use-case';
import { getTestPlanssUseCase } from 'src/core/application/use-cases/get-test-plans.use-case';
import { TestPlanRepositoryV2 } from 'src/core/infrastructure/repositories/test-plan/test-plan.repository-v2';
import { UsersRepository } from 'src/core/infrastructure/repositories/users/users.repository';
import { AuthorizationGuard } from 'src/foundation/guards/authorization.guard';
import { AddTestPlanDto, UploadPlanDto } from '../../dto/test-plan.dto';

@Controller('test-plan-management')
export class TestPlanController {
  constructor(
    private readonly testPlanRepo: TestPlanRepositoryV2,
    private readonly userRepo: UsersRepository,
  ) {}

  @UseGuards(AuthorizationGuard)
  @Post('upload')
  async uploadFile(@Body() uploadFileDto: UploadPlanDto) {
    const testData = await this.testPlanRepo.processBase64File(uploadFileDto);
    return {
      fileName: uploadFileDto.fileName,
      ...testData,
    };
  }

  @UseGuards(AuthorizationGuard)
  @Post('add-test-plan')
  async addTestPlan(@Body() addTestPlanDto: AddTestPlanDto) {
    await addTestPlanUseCase(addTestPlanDto, this.testPlanRepo, this.userRepo);
    return {
      message: 'Test plan added successfully',
    };
  }

  @UseGuards(AuthorizationGuard)
  @Get('get-test-plans/:projectId')
  async getProjects(@Param('projectId') projectId: string) {
    const testPlans = await getTestPlanssUseCase(
      projectId,
      this.testPlanRepo,
      this.userRepo,
    );
    return {
      message: 'Test plans fetched successfully',
      data: testPlans,
    };
  }
}
