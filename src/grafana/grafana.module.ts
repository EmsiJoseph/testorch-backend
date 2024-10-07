// grafana.module.ts
import { Module } from "@nestjs/common";
import { GrafanaService } from "./grafana.service";
import { KubernetesClientModule } from "../kubernetes-management/kubernetes-client.module";
import { UtilsModule } from "../utils/utils.module";

@Module({
  imports: [KubernetesClientModule, UtilsModule], // Import LoggingModule here
  providers: [GrafanaService],
  exports: [GrafanaService],
})
export class GrafanaModule {}
