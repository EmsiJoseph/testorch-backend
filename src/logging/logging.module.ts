// src/logging/logging.module.ts
import { Module } from "@nestjs/common";
import { LoggingService } from "./logging.service";

@Module({
  providers: [LoggingService],
  exports: [LoggingService], // Export the LoggingService to be used in other modules
})
export class LoggingModule {}
