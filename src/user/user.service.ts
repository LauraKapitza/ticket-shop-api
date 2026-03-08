import { Injectable } from "@nestjs/common";
import { users as UserModel } from "../../prisma/generated/prisma/client";
import { DatabaseService } from "../database/database.service";

@Injectable()
export class UserService {
    constructor(private db: DatabaseService) {}

    async findUnique(email: string): Promise<UserModel | null> {
        return this.db.users.findUnique({
            where: { email: email }
        });
    }
}
