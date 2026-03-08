import { users as UserModel } from "../prisma/generated/prisma/client";
import md5 from "md5";

export const mockUserPassword: string = "password123";
const mockUserId = 1;
const hashedPassword = md5(`${mockUserId}${mockUserPassword}`) as string;

export const mockUser: UserModel = {
    id: mockUserId,
    name: "Test User",
    email: "test@example.com",
    password_hash: hashedPassword
};
