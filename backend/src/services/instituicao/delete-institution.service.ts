import { deleteInstitutionNeo4j } from "./neo4j/neo4jInstitutionService";

export async function deleteInstitutionService(id: string): Promise<void> {
  await deleteInstitutionNeo4j(id);
}