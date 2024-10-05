import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TeamManagementModule } from "../team-management/team-management.module";
import { KubernetesManagementModule } from "../kubernetes-management/kubernetes-management.module";
import { LoggingModule } from "../logging/logging.module";

@Module({
  controllers: [AppController],
  imports: [TeamManagementModule, KubernetesManagementModule, LoggingModule],
  providers: [AppService], // No need to add KubernetesManagementService here
})
export class AppModule {}
