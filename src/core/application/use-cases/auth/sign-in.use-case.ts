import {verify} from "@node-rs/argon2";
import {AuthenticationError} from "../../../domain/errors/auth";
import {IUsersRepository} from "../../interfaces/repositories/users.repository.interface";
import {IAuthenticationService} from "../../interfaces/services/authentication.service.interface";
import {Session} from "../../../domain/models/session";
import {Cookie} from "../../../domain/models/cookie";
import {SignInDto} from "../../../presentation/dto/user.dto";


export async function signInUseCase(input: SignInDto,
                                    usersRepository: IUsersRepository,
                                    authService: IAuthenticationService
): Promise<{ session: Session; cookie: Cookie }> {

    const existingUser = await usersRepository.getUserByEmail(
        input.email,
    );

    if (!existingUser) {
        throw new AuthenticationError("User does not exist");
    }

    const validPassword = await verify(existingUser.password_hash, input.password_hash, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
    });

    if (!validPassword) {
        throw new AuthenticationError("Incorrect email or password");
    }

    return await authService.createSession(existingUser);

}