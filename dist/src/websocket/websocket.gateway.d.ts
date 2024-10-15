import { Server, Socket } from "socket.io";
export declare class WebsocketGateway {
    server: Server;
    private readonly logger;
    handleStartTestPlan(client: Socket, payload: {
        testPlanId: string;
        userId: string;
    }): void;
    handleStopTestPlan(client: Socket, payload: {
        testPlanId: string;
        userId: string;
    }): void;
    handleLoadGeneratorStatus(client: Socket, payload: {
        loadGeneratorId: string;
        status: string;
    }): void;
    handleTestProgress(client: Socket, payload: {
        testPlanId: string;
        progress: number;
    }): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
}
