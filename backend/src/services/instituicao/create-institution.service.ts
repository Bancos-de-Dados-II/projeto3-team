import prisma from "../../prisma/client";
import { Institution } from "../../@types/instituicao";
import { createInstitutionNeo4j }  from "./neo4j/neo4jInstitutionService";

export async function createInstitutionService(data: Institution): Promise<void> {
  const { name, cnpj, contact, description, positionX, positionY } = data;

  const cria = await prisma.instituicao.create({
    data: {
      name,
      cnpj,
      contact,
      description,
      localization : {
        type: "Point",
        coordinates: [positionX, positionY],  //[longitude, latitude]
      }
    }
  });

  await createInstitutionNeo4j(cria.id, 
    cria.name, 
    cria.cnpj, 
    cria.contact, 
    cria.description, 
    cria.localization.coordinates[0], //positionX 
    cria.localization.coordinates[1] //positionY
  );
}
