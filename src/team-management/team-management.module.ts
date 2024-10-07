import { Module } from "@nestjs/common";
import { TeamManagementController } from "./team-management.controller";
import { TeamManagementService } from "./team-management.service";
import { KubernetesManagementModule } from "../kubernetes-management/kubernetes-management.module";

@Module({
  controllers: [TeamManagementController],
  exports: [TeamManagementService],
  imports: [KubernetesManagementModule],
  providers: [TeamManagementService],
})
export class TeamManagementModule {}
