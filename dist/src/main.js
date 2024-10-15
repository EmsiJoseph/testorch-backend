"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const helmet = require("helmet");
const app_module_1 = require("./app.module");
const all_exceptions_filter_1 = require("./exception-filters/all-exceptions.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
    app.use(helmet.default());
    app.useWebSocketAdapter(new platform_socket_io_1.IoAdapter(app));
    app.enableCors();
    const globalPrefix = "api";
    app.setGlobalPrefix(globalPrefix);
    const port = process.env.PORT || 5000;
    const server = await app.listen(port);
    const gracefulShutdown = () => {
        console.log("Shutting down gracefully...");
        server.close(() => {
            console.log("Closed out remaining connections");
            process.exit(0);
        });
        setTimeout(() => {
            console.error("Could not close connections in time, forcefully shutting down");
            process.exit(1);
        }, 10000);
    };
    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
    process.on("unhandledRejection", (reason, promise) => {
        console.error("Unhandled Rejection at:", promise, "reason:", reason);
    });
    process.on("uncaughtException", error => {
        console.error("Uncaught Exception:", error);
    });
    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
    common_1.Logger.log(`🚀 Testorch-Backend is running on: http://localhost:${port}/${globalPrefix}`);
}
bootstrap();
//# sourceMappingURL=main.js.map