import {IsEmail, IsOptional, IsString, MaxLength, MinLength,} from 'class-validator';
import {Match} from "../../../decorators/match.decorator";

export class SignUpDto {
    @IsString()
    @IsOptional()
    id: string;

    @IsString()
    @MinLength(3)
    @MaxLength(31)
    first_name: string;

    @IsString()
    @MinLength(3)
    @MaxLength(31)
    last_name: string;

    @IsString()
    @IsEmail({}, {message: 'Invalid email address'})
    @MaxLength(255)
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(31)
    password_hash: string;

    @IsString()
    @MinLength(6)
    @MaxLength(31)
    @Match('password_hash', {message: 'Passwords do not match'})
    confirm_password: string;
}

export class SignInDto {
    @IsString()
    @IsEmail({}, {message: 'Invalid email address'})
    @MaxLength(255)
    email: string;

    @IsString()
    password_hash: string;
}
