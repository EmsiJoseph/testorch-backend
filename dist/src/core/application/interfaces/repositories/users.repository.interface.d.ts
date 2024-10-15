import { NewUser, User } from "../../../domain/models/user";
export declare const USERS_REPOSITORY_TOKEN: unique symbol;
export interface IUsersRepository {
    getUser(id: string): Promise<User | undefined>;
    getUserByEmail(username: string): Promise<User | undefined>;
    createUser(input: NewUser): Promise<User>;
}
