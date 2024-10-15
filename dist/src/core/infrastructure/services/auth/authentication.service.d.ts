import { Lucia } from "lucia";
import { IAuthenticationService } from "../../../application/interfaces/services/authentication.service.interface";
import { IUsersRepository } from "../../../application/interfaces/repositories/users.repository.interface";
import { Session } from "../../../domain/models/session";
import { User } from "../../../domain/models/user";
import { Cookie } from "../../../domain/models/cookie";
export declare class AuthenticationService implements IAuthenticationService {
    private _usersRepository;
    private _lucia;
    constructor(_usersRepository: IUsersRepository);
    validateSession(sessionId: string): Promise<{
        user: User;
        session: Session;
    }>;
    createSession(user: User): Promise<{
        session: Session;
        cookie: Cookie;
    }>;
    invalidateSession(sessionId: string): Promise<{
        blankCookie: Cookie;
    }>;
    generateUserId(): string;
}
interface DatabaseUserAttributes {
    email: string;
}
declare module "lucia" {
    interface Register {
        Lucia: Lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}
export {};
