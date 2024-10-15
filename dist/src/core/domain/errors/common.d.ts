/// <reference types="node" />
import { IncomingMessage } from "http";
export declare class DatabaseOperationError extends Error {
    constructor(message: string, options?: ErrorOptions);
}
export declare class NotFoundError extends Error {
    constructor(message: string, options?: ErrorOptions);
}
export declare class InputParseError extends Error {
    constructor(message: string, options?: ErrorOptions);
}
export interface KubernetesHttpError extends Error {
    response: IncomingMessage & {
        body?: {
            message?: string;
        };
    };
}
