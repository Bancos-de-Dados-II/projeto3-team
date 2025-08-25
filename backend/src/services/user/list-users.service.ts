import prisma from "../../prisma/client";
import { User } from "../../@types/user";

export async function listUsersService(): Promise<Omit<User, "password">[]>{
    const users = await prisma.user.findMany();
    return users.map(({ password, ...resto }) => resto);
}


/* import { UserModel } from "../../models/user";
import { User } from "../../@types/user";


export async function listUsersService(): Promise<Omit<User, "password">[]> {
  const users = await UserModel.find().lean<User[]>();

  return users.map((user: User) => {
    const { password, ...rest } = user; 
    return rest;
  });
}
*/