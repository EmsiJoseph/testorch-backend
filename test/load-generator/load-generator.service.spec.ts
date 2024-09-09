import { Test, TestingModule } from "@nestjs/testing";
import { LoadGeneratorService } from "../../src/load-generator/load-generator.service";

describe("LoadGeneratorService", () => {
  let service: LoadGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoadGeneratorService],
    }).compile();

    service = module.get<LoadGeneratorService>(LoadGeneratorService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
