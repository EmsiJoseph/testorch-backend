import { Module } from "@nestjs/common";
import { KubernetesManagementService } from "./kubernetes-management.service";
import { LoggingModule } from "../logging/logging.module";

@Module({
  providers: [KubernetesManagementService], // Register the service here
  imports: [LoggingModule],
  exports: [KubernetesManagementService], // Export the service for use in other modules
})
export class KubernetesManagementModule {}
