import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import * as helmet from "helmet";

import { AppModule } from "./app.module/app.module";
import { AllExceptionsFilter } from "./all-exceptions.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply the global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Enable security headers
  app.use(helmet.default());

  // Enable WebSockets with Socket.IO adapter
  app.useWebSocketAdapter(new IoAdapter(app));

  // Enable CORS if needed, you can configure it according to your use case
  app.enableCors();

  // Set global prefix for the API
  const globalPrefix = "api";
  app.setGlobalPrefix(globalPrefix);

  // WebSocket or any real-time communication setup if required
  const port = process.env.PORT || 5000;

  const server = await app.listen(port);

  const gracefulShutdown = () => {
    console.log("Shutting down gracefully...");
    server.close(() => {
      console.log("Closed out remaining connections");
      process.exit(0);
    });

    setTimeout(() => {
      console.error(
        "Could not close connections in time, forcefully shutting down",
      );
      process.exit(1);
    }, 10000); // Wait for 10 seconds before forcefully shutting down
  };

  // Listen for termination signals (e.g., Ctrl + C)
  process.on("SIGTERM", gracefulShutdown);
  process.on("SIGINT", gracefulShutdown);

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    // Log and handle the error accordingly
  });

  // Handle uncaught exceptions
  process.on("uncaughtException", error => {
    console.error("Uncaught Exception:", error);
    // Log and handle the error accordingly
  });

  Logger.log(
    `🚀 LG-Orchestrator is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
