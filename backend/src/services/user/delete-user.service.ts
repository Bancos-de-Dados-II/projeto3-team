import { UserModel } from "../../models/user";
import { deleteUserNeo4j } from "./neo4j/neo4jUserService";

export async function deleteUserService(id: string) {
  await UserModel.findByIdAndDelete(id);
  await deleteUserNeo4j(id);
  return true;
}