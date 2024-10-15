import { Cookie } from "../../../domain/models/cookie";
import { IAuthenticationService } from "../../interfaces/services/authentication.service.interface";
export declare function signOutUseCase(sessionId: string, authService: IAuthenticationService): Promise<{
    blankCookie: Cookie;
}>;
