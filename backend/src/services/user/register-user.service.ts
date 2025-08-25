import prisma from "../../prisma/client";
import { User } from "../../@types/user";
import { createPasswordHash } from "../../utils/hash.util";
import { createUserNeo4j } from "./neo4j/neo4jUserService";

// Serviço para registrar um novo usuário
export async function registerUserService(name: string, email: string, password: string): Promise<Omit<User, "password">> {
  const passwordHash = await createPasswordHash(password);
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash
    },
  });

  await createUserNeo4j(newUser.id, name, email);

  // Remove a senha antes de retornar
  const { password: _, ...userWithoutPassword } = newUser;

  return userWithoutPassword;
}
