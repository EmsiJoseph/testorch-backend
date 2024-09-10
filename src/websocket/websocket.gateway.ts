import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
@WebSocketGateway({
  cors: {
    origin: "*", // Adjust to your needs
  },
})
export class WebsocketGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebsocketGateway.name);

  // Event to handle a new test plan execution request
  @SubscribeMessage("startTestPlan")
  handleStartTestPlan(
    client: Socket,
    payload: { testPlanId: string; userId: string },
  ): void {
    this.logger.log(
      `Test Plan Execution Started for Test Plan ID: ${payload.testPlanId}, User: ${payload.userId}`,
    );

    // Broadcast to all clients that a test plan has started
    this.server.emit("testPlanStarted", {
      message: "Test Plan started successfully",
      testPlanId: payload.testPlanId,
      userId: payload.userId,
    });
  }

  // Event to handle a stop test plan execution request
  @SubscribeMessage("stopTestPlan")
  handleStopTestPlan(
    client: Socket,
    payload: { testPlanId: string; userId: string },
  ): void {
    this.logger.log(
      `Test Plan Execution Stopped for Test Plan ID: ${payload.testPlanId}, User: ${payload.userId}`,
    );

    // Broadcast to all clients that a test plan has stopped
    this.server.emit("testPlanStopped", {
      message: "Test Plan stopped successfully",
      testPlanId: payload.testPlanId,
      userId: payload.userId,
    });
  }

  // Event to monitor real-time status updates from load generators
  @SubscribeMessage("loadGeneratorStatus")
  handleLoadGeneratorStatus(
    client: Socket,
    payload: { loadGeneratorId: string; status: string },
  ): void {
    this.logger.log(
      `Load Generator ID: ${payload.loadGeneratorId} Status: ${payload.status}`,
    );

    // Broadcast the status to all clients
    this.server.emit("loadGeneratorStatusUpdate", {
      loadGeneratorId: payload.loadGeneratorId,
      status: payload.status,
    });
  }

  // Event to notify real-time progress of a test plan
  @SubscribeMessage("testProgress")
  handleTestProgress(
    client: Socket,
    payload: { testPlanId: string; progress: number },
  ): void {
    this.logger.log(
      `Test Plan ID: ${payload.testPlanId} Progress: ${payload.progress}%`,
    );

    // Broadcast test progress to all clients
    this.server.emit("testProgressUpdate", {
      testPlanId: payload.testPlanId,
      progress: payload.progress,
    });
  }

  // Handling client connection
  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  // Handling client disconnection
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
