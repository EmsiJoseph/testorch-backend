import { AppService } from "./app.service";
import { Controller, Get } from "@nestjs/common";

@Controller("app")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/start")
  async startApp() {
    return this.appService.startApp();
  }
}
