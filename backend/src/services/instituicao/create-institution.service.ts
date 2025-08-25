import { Institution } from "../../@types/instituicao";
import prisma from "../../prisma/client";
import { createInstitutionNeo4j } from "./neo4j/neo4jInstitutionService";
export async function createInstitutionService(data: Institution): Promise<void> {
  const { name, cnpj, contact, description, positionX, positionY, userId } = data;
  // const id = uuidv4(); // Gera um ID único

  const institution = await prisma.instituicao.create({
    data: {
      name,
      cnpj,
      contact,
      description,
      localization: {
        type: "Point",
        coordinates: [positionX, positionY],  // Mongo uses [longitude, latitude] 
      },
      createdBy: { connect: { id: userId } },
    }
  });

  await createInstitutionNeo4j(
    institution.id,
    name,
    cnpj,
    contact,
    description,
    positionX,
    positionY,
    userId
  );
}