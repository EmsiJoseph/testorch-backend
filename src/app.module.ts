import { Module } from "@nestjs/common";
import { TeamManagementModule } from "./team-management/team-management.module";
import { KubernetesManagementModule } from "./kubernetes-management/kubernetes-management.module";
import { GrafanaModule } from "./grafana/grafana.module";
import { InfluxdbModule } from "./influxdb/influxdb.module";
import { JmeterModule } from "./jmeter/jmeter.module";
import { UtilsModule } from "./utils/utils.module";

@Module({
  imports: [
    TeamManagementModule,
    KubernetesManagementModule,
    UtilsModule,
    GrafanaModule,
    InfluxdbModule,
    JmeterModule,
  ],
})
export class AppModule {}
