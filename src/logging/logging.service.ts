import { Injectable, LoggerService, Logger } from "@nestjs/common";

@Injectable()
export class LoggingService implements LoggerService {
  private readonly logger = new Logger();

  /**
   * Log a message at the 'info' level.
   * @param message The message to log.
   */
  log(message: string): void {
    this.logger.log(message);
  }

  /**
   * Log a message at the 'error' level.
   * @param message The message to log.
   * @param trace Optional stack trace to include in the log.
   */
  error(message: string, trace?: string): void {
    this.logger.error(message, trace);
  }

  /**
   * Log a message at the 'warn' level.
   * @param message The message to log.
   */
  warn(message: string): void {
    this.logger.warn(message);
  }

  /**
   * Log a message at the 'debug' level.
   * @param message The message to log.
   */
  debug(message: string): void {
    this.logger.debug(message);
  }

  /**
   * Log a message at the 'verbose' level.
   * @param message The message to log.
   */
  verbose(message: string): void {
    this.logger.verbose(message);
  }
}
