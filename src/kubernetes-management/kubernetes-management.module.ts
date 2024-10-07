import { Module } from "@nestjs/common";
import { KubernetesManagementService } from "./kubernetes-management.service";
import { InfluxdbModule } from "../influxdb/influxdb.module";
import { GrafanaModule } from "../grafana/grafana.module";
import { JmeterModule } from "../jmeter/jmeter.module";
import { KubernetesClientModule } from "./kubernetes-client.module";

@Module({
  providers: [KubernetesManagementService], // Register the service here
  imports: [
    InfluxdbModule,
    GrafanaModule,
    JmeterModule,
    KubernetesClientModule,
  ],
  exports: [KubernetesManagementService], // Export the service for use in other modules
})
export class KubernetesManagementModule {}
