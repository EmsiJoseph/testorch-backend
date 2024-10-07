import { Module } from "@nestjs/common";
import { UtilsService } from "./utils.service";
import { KubernetesClientModule } from "../kubernetes-management/kubernetes-client.module";
import { KubernetesClientService } from "../kubernetes-management/kubernetes-client.service";

@Module({
  providers: [UtilsService, KubernetesClientService],
  imports: [KubernetesClientModule],
  exports: [UtilsService], // Export the service to be used in other modules
})
export class UtilsModule {}
