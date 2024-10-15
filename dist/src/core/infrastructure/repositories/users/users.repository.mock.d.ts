import { IUsersRepository } from "../../../application/interfaces/repositories/users.repository.interface";
import { User } from "../../../domain/models/user";
export declare class MockUsersRepository implements IUsersRepository {
    private _users;
    constructor();
    getUser(id: string): Promise<User | undefined>;
    getUserByEmail(email: string): Promise<User | undefined>;
    createUser(input: User): Promise<User>;
}
