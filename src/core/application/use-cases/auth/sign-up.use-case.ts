import {hash} from "@node-rs/argon2";
import {IAuthenticationService} from "../../interfaces/services/authentication.service.interface";
import {IUsersRepository} from "../../interfaces/repositories/users.repository.interface";
import {Session} from "../../../domain/models/session";
import {Cookie} from "../../../domain/models/cookie";
import {AuthenticationError} from "../../../domain/errors/auth";
import {SignUpDto} from "../../../presentation/dto/user.dto";
import {NewUser, User} from "../../../domain/models/user";

export async function signUpUseCase(input: SignUpDto,
                                    usersRepository: IUsersRepository,
                                    authService: IAuthenticationService
): Promise<{
    session: Session;
    cookie: Cookie;
    user: Pick<User, "id" | "email" | "first_name" | "last_name">;
}> {
    const user = await usersRepository.getUserByEmail(input.email);
    if (user) {
        throw new AuthenticationError("Email is already taken");
    }

    const passwordHash = await hash(input.password_hash, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
    });

    const userId = authService.generateUserId();

    // Ensure userId is not undefined
    if (!userId) {
        throw new Error("Failed to generate user ID");
    }

    const newUser: NewUser = {
        id: userId,
        first_name: input.first_name,
        last_name: input.last_name,
        email: input.email,
        password_hash: passwordHash,
    };

    const createdUser = await usersRepository.createUser(newUser);

    const {cookie, session} = await authService.createSession(createdUser);

    return {
        session,
        cookie,
        user: {
            id: createdUser.id,              // Ensure id is string
            first_name: createdUser.first_name,
            last_name: createdUser.last_name,
            email: createdUser.email,
        },
    };
}
