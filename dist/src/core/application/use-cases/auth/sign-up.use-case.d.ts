import { IAuthenticationService } from "../../interfaces/services/authentication.service.interface";
import { IUsersRepository } from "../../interfaces/repositories/users.repository.interface";
import { Session } from "../../../domain/models/session";
import { Cookie } from "../../../domain/models/cookie";
import { SignUpDto } from "../../../presentation/dto/user.dto";
import { User } from "../../../domain/models/user";
export declare function signUpUseCase(input: SignUpDto, usersRepository: IUsersRepository, authService: IAuthenticationService): Promise<{
    session: Session;
    cookie: Cookie;
    user: Pick<User, "id" | "email" | "first_name" | "last_name">;
}>;
