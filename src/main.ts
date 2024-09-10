import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import * as helmet from "helmet";

import { AppModule } from "./app.module/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
  await app.listen(port);

  Logger.log(
    `🚀 LG-Orchestrator is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
