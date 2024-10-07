import { Module } from "@nestjs/common";
import { JmeterService } from "./jmeter.service";
import { LoggingModule } from "../../dist/logging/logging.module";
import { KubernetesClientModule } from "../kubernetes-management/kubernetes-client.module";
import { UtilsModule } from "../utils/utils.module";

@Module({
  providers: [JmeterService],
  imports: [LoggingModule, KubernetesClientModule, UtilsModule],
  exports: [JmeterService],
})
export class JmeterModule {}
