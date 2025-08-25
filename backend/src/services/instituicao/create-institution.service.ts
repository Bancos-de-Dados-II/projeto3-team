import { Institution } from "../../@types/instituicao";
import { createInstitutionNeo4j } from "./neo4j/neo4jInstitutionService";

export async function createInstitutionService(data: Institution): Promise<void> {
  const { name, cnpj, contact, description, positionX, positionY, userId } = data;
  // const id = uuidv4(); // Gera um ID único

  await createInstitutionNeo4j(
    name,
    cnpj,
    contact,
    description,
    positionX,
    positionY,
    userId 
  );
}