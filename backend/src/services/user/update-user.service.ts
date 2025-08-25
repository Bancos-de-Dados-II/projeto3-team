import { UserModel } from "../../models/user";
import { updateUserNeo4j } from "./neo4j/neo4jUserService";
import prisma from "../../prisma/client";

export async function updateUserService(id: string, name: string) {

  const user = await prisma.user.update({
    where: { id },
    data: { name }
  });

  // const updatedUser = await UserModel.findByIdAndUpdate(id, { name }, { new: true });

  if (user) {
    await updateUserNeo4j(id, name);
  }

  return user;
}