import prisma from "../../prisma/client";
import { Institution } from "../../@types/instituicao";

export async function createInstitutionService(data: Institution, userId: string): Promise<void> {
  const { name, cnpj, contact, description, positionX, positionY } = data;
  
  await prisma.instituicao.create({
    data: {
      name,
      cnpj,
      contact,
      description,
      localization : {
        type: "Point",
        coordinates: [positionX, positionY],  // Mongo uses [longitude, latitude] 
      },
      createdBy: { connect: { id: userId } },
    }
  });
}
