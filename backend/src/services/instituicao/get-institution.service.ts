import { InstitutionGet } from "../../@types/instituicao";
import { getInstitutionNeo4j } from "./neo4j/neo4jInstitutionService";

export async function getInstitutionService(): Promise<InstitutionGet[]> {
  try {
    const institutions = await getInstitutionNeo4j();
    return institutions;
  } catch (error) {
    console.error("Erro ao listar instituições:", error);
    return [];
  }
}