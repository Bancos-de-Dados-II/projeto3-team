import { InstitutionUpdate } from "../../@types/instituicao";
import { updateInstitutionNeo4j } from "./neo4j/neo4jInstitutionService";

export async function updateInstitutionService(id: string, data: InstitutionUpdate): Promise<void> {
  const { name, contact, description, positionX, positionY } = data;
  const coordinates = [(Number)(positionX), (Number)(positionY)];

  await updateInstitutionNeo4j(id, { 
    name, 
    contact, 
    description,
    positionX: coordinates[0],
    positionY: coordinates[1]});
}