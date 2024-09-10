import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  startApp() {
    return "LG-Orchestrator Service is starting...";
  }
}
