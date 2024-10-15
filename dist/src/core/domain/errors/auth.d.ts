export declare class AuthenticationError extends Error {
    constructor(message: string, options?: ErrorOptions);
}
export declare class UnauthenticatedError extends Error {
    constructor(message: string, options?: ErrorOptions);
}
export declare class UnauthorizedError extends Error {
    constructor(message: string, options?: ErrorOptions);
}
