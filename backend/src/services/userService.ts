import { UserModel } from "../models/user";
import driver from "../database/neo4j";


export const UserService = {
  //CREATE
  create: async (name: string, email: string) => {
    //Salva no MongoDB
    const mongoUser = await UserModel.create({ name, email });

    //Salva no Neo4j
    const session = driver.session();
    try {
      await session.run(
        "CREATE (u:User {id: $id, name: $name, email: $email}) RETURN u",
        { id: mongoUser._id.toString(), name, email }
      );
    } finally {
      await session.close();
    }

    return mongoUser;
  },

  //READ (MongoDB)
  getAll: async () => {
    return UserModel.find();
  },

  //UPDATE
  update: async (id: string, name: string) => {
    //MongoDB
    const mongoUser = await UserModel.findByIdAndUpdate(id, { name }, { new: true });

    //Neo4j
    const session = driver.session();
    try {
      await session.run(
        "MATCH (u:User {id: $id}) SET u.name = $name RETURN u",
        { id, name }
      );
    } finally {
      await session.close();
    }

    return mongoUser;
  },

  // DELETE
  delete: async (id: string) => {
    // MongoDB
    await UserModel.findByIdAndDelete(id);

    // Neo4j
    const session = driver.session();
    try {
      await session.run("MATCH (u:User {id: $id}) DETACH DELETE u", { id });
    } finally {
      await session.close();
    }

    return true;
  }
};
