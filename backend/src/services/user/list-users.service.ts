import prisma from "../../prisma/client";
import { User } from "../../@types/user";

export async function listUsersService(): Promise<Omit<User, "password">[]>{
    const users = await prisma.user.findMany();
    return users.map(({ password, ...resto }) => resto);
}