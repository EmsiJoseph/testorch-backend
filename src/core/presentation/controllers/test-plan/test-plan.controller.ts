import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { addTestPlanV2UseCase } from 'src/core/application/use-cases/add-test-plan-v2.use-case';
import { addTestPlanUseCase } from 'src/core/application/use-cases/add-test-plan.use-case';
import { getTestPlanssUseCase } from 'src/core/application/use-cases/get-test-plans.use-case';
import { startTestPlanV2UseCase } from 'src/core/application/use-cases/start-test-plan-v2.use-case';
import { TeamRepository } from 'src/core/infrastructure/repositories/team/team.repository';
import { TestPlanRepositoryV2 } from 'src/core/infrastructure/repositories/test-plan/test-plan.repository-v2';
import { UsersRepository } from 'src/core/infrastructure/repositories/users/users.repository';
import { GitHubService } from 'src/core/infrastructure/services/github/github.service';
import { JmeterService } from 'src/core/infrastructure/services/jmeter/jmeter.service';
import { SetupService } from 'src/core/infrastructure/services/setup.service';
import { AuthorizationGuard } from 'src/foundation/guards/authorization.guard';
import { AddTestPlanDto, AddTestPlanV2Dto } from '../../dto/test-plan.dto';

@Controller('test-plan-management')
export class TestPlanController {
  constructor(
    private readonly testPlanRepo: TestPlanRepositoryV2,
    private readonly userRepo: UsersRepository,
    private readonly jmeterService: JmeterService, // Inject JmeterService
    private readonly githubService: GitHubService, // Inject GitHubService
    private readonly teamRepo: TeamRepository,
    private readonly configService: ConfigService,
    private readonly setupService: SetupService,
  ) {}

  @UseGuards(AuthorizationGuard)
  @Post('add-test-plan')
  async addTestPlan(@Body() addTestPlanDto: AddTestPlanDto) {
    const testData = await addTestPlanUseCase(
      addTestPlanDto,
      this.testPlanRepo,
      this.userRepo,
    );
    return {
      message: 'Test plan added successfully',
      ...testData,
    };
  }

  @UseGuards(AuthorizationGuard)
  @Post('add-test-plan-v2')
  async addTestPlanV2(@Body() addTestPlanV2Dto: AddTestPlanV2Dto) {
    const testData = await addTestPlanV2UseCase(
      addTestPlanV2Dto,
      this.testPlanRepo,
      this.userRepo,
      this.githubService,
      this.teamRepo,
      this.jmeterService,
      this.setupService,
      this.configService,
    );
    return {
      message: 'Test plan added successfully',
      ...testData,
    };
  }

  @UseGuards(AuthorizationGuard)
  @Get('get-test-plans/:projectName')
  async getTestPlans(
    @Param('projectName') projectName: string,
    @Request() req,
  ) {
    const userId = req.auth.sub; // Assuming the user ID is in the 'sub' field
    console.log(projectName);
    const testPlans = await getTestPlanssUseCase(
      projectName,
      userId,
      this.testPlanRepo,
      this.userRepo,
    );
    return {
      message: 'Test plans fetched successfully',
      data: testPlans,
    };
  }

  @UseGuards(AuthorizationGuard)
  @Post('start-test')
  async startTest(
    @Body() startTestDto: { fileName: string; workerNodes: number },
  ) {
    const { fileName, workerNodes } = startTestDto;
    const jmxUrl = this.testPlanRepo.getFilePath(fileName);
    console.log(jmxUrl);
    const result = await this.jmeterService.startTest(jmxUrl, workerNodes);
    return {
      message: 'Test started successfully',
      ...result,
    };
  }

  @UseGuards(AuthorizationGuard)
  @Post('start-test-v2')
  async startTestV2(
    @Body() startTestDto: { testPlanName: string; workerNodes: number, projectName: string },
  ) {
    console.log(startTestDto);
    const { testPlanName, workerNodes, projectName} = startTestDto;

    const result = await startTestPlanV2UseCase(
      testPlanName,
      workerNodes,
      projectName,
      this.testPlanRepo,
      this.jmeterService,
    );
    return result;
  }
}
