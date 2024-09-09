import { Controller, Post, Delete, Get, Body, Param } from "@nestjs/common";
import { LoadGeneratorService } from "./load-generator.service";
import { TestPlanService } from "../test-plan/test-plan.service";

@Controller("load-generators")
export class LoadGeneratorController {
  constructor(
    private readonly loadGeneratorService: LoadGeneratorService,
    private readonly testPlanService: TestPlanService,
  ) {}

  @Post("spawn")
  async spawnLoadGenerator(@Body("config") config: any) {
    return this.loadGeneratorService.spawnLoadGenerator(config);
  }

  @Delete("terminate/:id")
  async terminateLoadGenerator(@Param("id") id: string) {
    return this.loadGeneratorService.terminateLoadGenerator(id);
  }

  @Post("execute")
  async executeTestPlan(
    @Body() { planId, overrideConfig }: { planId: string; overrideConfig: any },
  ) {
    const overriddenPlan = await this.testPlanService.overrideTestPlan(
      planId,
      overrideConfig,
    );
    return this.loadGeneratorService.executeTestPlan(overriddenPlan);
  }

  @Get("status")
  async getStatus() {
    return this.loadGeneratorService.getLoadGeneratorStatus();
  }
}
