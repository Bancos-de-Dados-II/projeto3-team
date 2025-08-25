import { updateUserNeo4j } from "./neo4j/neo4jUserService";
import prisma from "../../prisma/client";

export async function updateUserService(id: string, name: string) {

  const user = await prisma.user.update({
    where: { id },
    data: { name }
  });

  if (user) {
    await updateUserNeo4j(id, name);
  }

  return user;
}