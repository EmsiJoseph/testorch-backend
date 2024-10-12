import {Session} from "../../../domain/models/session";
import {User} from "../../../domain/models/user";
import {Cookie} from "../../../domain/models/cookie";

export interface IAuthenticationService {
    generateUserId(): string;
    validateSession(
        sessionId: Session["id"],
    ): Promise<{ user: User; session: Session }>;
    createSession(user: User): Promise<{ session: Session; cookie: Cookie }>;
    invalidateSession(sessionId: Session["id"]): Promise<{ blankCookie: Cookie }>;
}
