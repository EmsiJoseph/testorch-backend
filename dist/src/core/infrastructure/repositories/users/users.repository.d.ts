import { IUsersRepository } from "../../../application/interfaces/repositories/users.repository.interface";
import { User } from "../../../domain/models/user";
import { SignUpDto } from "../../../presentation/dto/user.dto";
export declare class UsersRepository implements IUsersRepository {
    getUser(id: string): Promise<User | undefined>;
    getUserByEmail(email: string): Promise<User | undefined>;
    createUser(input: SignUpDto): Promise<User>;
}
