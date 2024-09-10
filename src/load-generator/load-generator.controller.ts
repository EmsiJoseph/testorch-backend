import { Controller, Post, Delete, Get, Body, Param } from "@nestjs/common";
import { LoadGeneratorService } from "./load-generator.service";

@Controller("load-generators")
export class LoadGeneratorController {
  constructor(private readonly loadGeneratorService: LoadGeneratorService) {}

  @Post("spawn")
  async spawnLoadGenerator(@Body("config") config: any) {
    return this.loadGeneratorService.spawnLoadGenerator(config);
  }

  @Delete("terminate/:id")
  async terminateLoadGenerator(@Param("id") id: string) {
    return this.loadGeneratorService.terminateLoadGenerator(id);
  }

  @Get("status")
  async getStatus() {
    return this.loadGeneratorService.getLoadGeneratorStatus();
  }
}
