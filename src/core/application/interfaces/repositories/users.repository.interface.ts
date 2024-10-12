import {NewUser, User} from "../../../domain/models/user";

export const USERS_REPOSITORY_TOKEN = Symbol('IUsersRepository');

export interface IUsersRepository {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(username: string): Promise<User | undefined>;
  createUser(input: NewUser): Promise<User>;
}
