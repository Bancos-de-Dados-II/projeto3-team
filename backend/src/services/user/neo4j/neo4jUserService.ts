import { getSession } from "../../../database/neo4j";

export async function createUserNeo4j(id: string, name: string, email: string) {
  const session = getSession();
  try {
    await session.run(
      "CREATE (u:User {id: $id, name: $name, email: $email}) RETURN u",
      { id, name, email }
    );
  } finally {
    await session.close();
  }
}

export async function updateUserNeo4j(id: string, name: string) {
  const session = getSession();
  try {
    await session.run(
      "MATCH (u:User {id: $id}) SET u.name = $name RETURN u",
      { id, name }
    );
  } finally {
    await session.close();
  }
}

export async function deleteUserNeo4j(id: string) {
  const session = getSession();
  try {
    await session.run("MATCH (u:User {id: $id}) DETACH DELETE u", { id });
  } finally {
    await session.close();
  }
}
