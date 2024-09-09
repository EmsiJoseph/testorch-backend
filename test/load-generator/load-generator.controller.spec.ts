import { Test, TestingModule } from "@nestjs/testing";
import { LoadGeneratorController } from "../../src/load-generator/load-generator.controller";

describe("LoadGeneratorController", () => {
  let controller: LoadGeneratorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoadGeneratorController],
    }).compile();

    controller = module.get<LoadGeneratorController>(LoadGeneratorController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
