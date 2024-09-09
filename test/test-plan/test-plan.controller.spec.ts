import { Test, TestingModule } from "@nestjs/testing";
import { TestPlanController } from "../../src/test-plan/test-plan.controller";

describe("TestPlanController", () => {
  let controller: TestPlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestPlanController],
    }).compile();

    controller = module.get<TestPlanController>(TestPlanController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
