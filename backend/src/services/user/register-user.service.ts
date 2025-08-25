import prisma from "../../prisma/client";
import { User } from "../../@types/user";
import { createPasswordHash } from "../../utils/hash.util";

// Serviço para registrar um novo usuário
export async function registerUserService(name: string, email: string, password: string): Promise<User> {

  const passwordHash = await createPasswordHash(password);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash
    },
  });

  return newUser;
}
