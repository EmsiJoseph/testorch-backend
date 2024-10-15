import { IUsersRepository } from "../../interfaces/repositories/users.repository.interface";
import { IAuthenticationService } from "../../interfaces/services/authentication.service.interface";
import { Session } from "../../../domain/models/session";
import { Cookie } from "../../../domain/models/cookie";
import { SignInDto } from "../../../presentation/dto/user.dto";
export declare function signInUseCase(input: SignInDto, usersRepository: IUsersRepository, authService: IAuthenticationService): Promise<{
    session: Session;
    cookie: Cookie;
}>;
