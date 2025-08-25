import { updateInstitutionNeo4j } from "./neo4j/neo4jInstitutionService";

export async function updateLocalizationInstitutionService(id: string, positionX: number, positionY: number): Promise<void> {
    await updateInstitutionNeo4j(id, { positionX, positionY });
}