import prisma from "../../prisma/client";
import { updateInstitutionNeo4j } from "./neo4j/neo4jInstitutionService";

export async function updateLocalizationInstitutionService(id: string, positionX: number, positionY: number): Promise<void> {
    //Atualiza Mongo
    await prisma.instituicao.update({
         where: { id }, 
         data: { 
            localization: { 
                type: "Point", 
                coordinates: [positionX, positionY] } 
            } 
        });

    //Atualiza Neo4j
    await updateInstitutionNeo4j(id, { positionX, positionY });

}