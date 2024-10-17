import { Module } from "@nestjs/common";
import { LoadGeneratorModule } from "../load-generator/load-generator.module";
import { TestPlanModule } from "../test-plan/test-plan.module";
import { MonitoringModule } from "../monitoring/monitoring.module";
import { ProjectModule } from "../project/project.module";
import { WebsocketGateway } from "../websocket/websocket.gateway";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  controllers: [AppController],
  imports: [LoadGeneratorModule, TestPlanModule, MonitoringModule, ProjectModule],
  providers: [WebsocketGateway, AppService],
})
export class AppModule {}
