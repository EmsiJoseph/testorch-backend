import { Module } from "@nestjs/common";
import { TeamManagementController } from "./team-management.controller";
import { TeamManagementService } from "./team-management.service";

@Module({
  controllers: [TeamManagementController],
  exports: [TeamManagementService],
  providers: [TeamManagementService],
})
export class TeamManagementModule {}
