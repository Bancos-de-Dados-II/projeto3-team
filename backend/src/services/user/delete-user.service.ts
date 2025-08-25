import { deleteUserNeo4j } from "./neo4j/neo4jUserService";
import prisma from "../../prisma/client";

export async function deleteUserService(id: string) {

  await prisma.user.delete({
    where: { id }
  });

  await deleteUserNeo4j(id);
  return true;
}
