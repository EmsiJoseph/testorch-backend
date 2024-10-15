import { UsersRepository } from "../../infrastructure/repositories/users/users.repository";
import { Cookie } from "../../domain/models/cookie";
import { AuthenticationService } from "../../infrastructure/services/auth/authentication.service";
import { SignInDto, SignUpDto } from "../dto/user.dto";
export declare class AuthController {
    private readonly userRepo;
    private readonly authService;
    constructor(userRepo: UsersRepository, authService: AuthenticationService);
    signIn(signInDto: SignInDto): Promise<Cookie>;
    signUp(signUpDto: SignUpDto): Promise<{
        session: {
            id?: string;
            userId?: string;
            expiresAt?: unknown;
        };
        cookie: Cookie;
        user: Pick<{
            id?: string;
            first_name?: string;
            last_name?: string;
            email?: string;
            password_hash?: string;
        }, "id" | "first_name" | "last_name" | "email">;
    }>;
}
