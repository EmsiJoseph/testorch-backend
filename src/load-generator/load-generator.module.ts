import { Module } from "@nestjs/common";
import { LoadGeneratorController } from "./load-generator.controller";
import { LoadGeneratorService } from "./load-generator.service";
import { TestPlanService } from "../test-plan/test-plan.service"; // Inject TestPlanService for overriding

@Module({
  controllers: [LoadGeneratorController],
  providers: [LoadGeneratorService, TestPlanService], // TestPlanService to handle plan overrides
  exports: [LoadGeneratorService],
})
export class LoadGeneratorModule {}
