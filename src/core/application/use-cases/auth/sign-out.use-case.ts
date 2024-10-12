import {Cookie} from "../../../domain/models/cookie";
import {IAuthenticationService} from "../../interfaces/services/authentication.service.interface";

export async function signOutUseCase(
    sessionId: string,
    authService: IAuthenticationService
): Promise<{ blankCookie: Cookie }> {
    return await authService.invalidateSession(sessionId);
}
