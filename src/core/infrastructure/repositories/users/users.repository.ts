import {eq} from "drizzle-orm";
import {Injectable} from "@nestjs/common";

import {IUsersRepository} from "../../../application/interfaces/repositories/users.repository.interface";
import {DatabaseOperationError} from "../../../domain/errors/common";
import {User} from "../../../domain/models/user";
import {db} from "../../database";
import {users} from "../../database/schema";
import {SignUpDto} from "../../../presentation/dto/user.dto";


@Injectable()
export class UsersRepository implements IUsersRepository {
    async getUser(id: string): Promise<User | undefined> {
        const query = db.query.users.findFirst({
            where: eq(users.id, id),
        });
        return await query.execute();
    }

    async getUserByEmail(email: string): Promise<User | undefined> {
        const query = db.query.users.findFirst({
            where: eq(users.email, email),
        });

        return await query.execute();
    }

    async createUser(input: SignUpDto): Promise<User> {
        const query = db.insert(users).values(input).returning();

        const [created] = await query.execute();

        if (created) {
            return created;
        } else {
            throw new DatabaseOperationError("Cannot create user.");
        }
    }
}
