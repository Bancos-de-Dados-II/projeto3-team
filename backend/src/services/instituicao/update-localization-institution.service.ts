import { updateInstitutionNeo4j } from "./neo4j/neo4jInstitutionService";
import prisma from "../../prisma/client";

export async function updateLocalizationInstitutionService(id: string, positionX: number, positionY: number): Promise<void> {
    await prisma.instituicao.update({ where: { id }, data: { localization: { type: "Point", coordinates: [positionX, positionY] } } });
    await updateInstitutionNeo4j(id, { positionX, positionY });
}