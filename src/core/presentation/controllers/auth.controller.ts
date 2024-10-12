import {UsersRepository} from "../../infrastructure/repositories/users/users.repository";
import {signInUseCase} from "../../application/use-cases/auth/sign-in.use-case";
import {Cookie} from "../../domain/models/cookie";
import {Body, Controller, Inject, Post, UsePipes, ValidationPipe} from "@nestjs/common";
import {AuthenticationService} from "../../infrastructure/services/auth/authentication.service";
import {signUpUseCase} from "../../application/use-cases/auth/sign-up.use-case";
import {SignInDto, SignUpDto} from "../dto/user.dto";
import {USERS_REPOSITORY_TOKEN} from "../../application/interfaces/repositories/users.repository.interface";


@Controller("auth")
export class AuthController {
    constructor(
        @Inject(USERS_REPOSITORY_TOKEN) private readonly userRepo: UsersRepository,
        private readonly authService: AuthenticationService
    ) {
    }

    @Post("sign-in")
    @UsePipes(new ValidationPipe({transform: true}))
    async signIn(@Body() signInDto: SignInDto): Promise<Cookie> {
        const {cookie} = await signInUseCase(signInDto, this.userRepo, this.authService);
        return cookie;
    }

    @Post("sign-up")
    @UsePipes(new ValidationPipe({transform: true}))
    async signUp(@Body() signUpDto: SignUpDto) {
        return await signUpUseCase(signUpDto, this.userRepo, this.authService);
    }
}

