// influxdb.module.ts
import { Module } from "@nestjs/common";
import { InfluxdbService } from "./influxdb.service";
import { UtilsModule } from "../utils/utils.module";
import { UtilsService } from "../utils/utils.service";
import { KubernetesClientModule } from "../kubernetes-management/kubernetes-client.module";

@Module({
  imports: [KubernetesClientModule, UtilsModule], // Import LoggingModule here
  providers: [InfluxdbService, UtilsService],
  exports: [InfluxdbService],
})
export class InfluxdbModule {}
