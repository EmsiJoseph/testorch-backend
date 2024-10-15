"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WebsocketGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let WebsocketGateway = WebsocketGateway_1 = class WebsocketGateway {
    server;
    logger = new common_1.Logger(WebsocketGateway_1.name);
    handleStartTestPlan(client, payload) {
        this.logger.log(`Test Plan Execution Started for Test Plan ID: ${payload.testPlanId}, User: ${payload.userId}`);
        this.server.emit("testPlanStarted", {
            message: "Test Plan started successfully",
            testPlanId: payload.testPlanId,
            userId: payload.userId,
        });
    }
    handleStopTestPlan(client, payload) {
        this.logger.log(`Test Plan Execution Stopped for Test Plan ID: ${payload.testPlanId}, User: ${payload.userId}`);
        this.server.emit("testPlanStopped", {
            message: "Test Plan stopped successfully",
            testPlanId: payload.testPlanId,
            userId: payload.userId,
        });
    }
    handleLoadGeneratorStatus(client, payload) {
        this.logger.log(`Load Generator ID: ${payload.loadGeneratorId} Status: ${payload.status}`);
        this.server.emit("loadGeneratorStatusUpdate", {
            loadGeneratorId: payload.loadGeneratorId,
            status: payload.status,
        });
    }
    handleTestProgress(client, payload) {
        this.logger.log(`Test Plan ID: ${payload.testPlanId} Progress: ${payload.progress}%`);
        this.server.emit("testProgressUpdate", {
            testPlanId: payload.testPlanId,
            progress: payload.progress,
        });
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
};
exports.WebsocketGateway = WebsocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WebsocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("startTestPlan"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleStartTestPlan", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("stopTestPlan"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleStopTestPlan", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("loadGeneratorStatus"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleLoadGeneratorStatus", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("testProgress"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleTestProgress", null);
exports.WebsocketGateway = WebsocketGateway = WebsocketGateway_1 = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: "*",
        },
    })
], WebsocketGateway);
//# sourceMappingURL=websocket.gateway.js.map