import { UserModel } from "../../models/user";
import { updateUserNeo4j } from "./neo4j/neo4jUserService";

export async function updateUserService(id: string, name: string) {
  const updatedUser = await UserModel.findByIdAndUpdate(id, { name }, { new: true });

  if (updatedUser) {
    await updateUserNeo4j(id, updatedUser.name);
  }

  return updatedUser?.toObject();
}