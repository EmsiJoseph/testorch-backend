import { Module } from "@nestjs/common";
import { KubernetesClientService } from "./kubernetes-client.service";

@Module({
  providers: [KubernetesClientService],
  exports: [KubernetesClientService], // Export the service to be used in other modules
})
export class KubernetesClientModule {}
