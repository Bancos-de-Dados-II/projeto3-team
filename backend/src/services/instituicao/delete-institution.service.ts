import prisma from "../../prisma/client";
import { Institution } from "../../@types/instituicao";

export async function deleteInstitutionService(id: string): Promise<void> {
  await prisma.instituicao.delete({
    where: {
      id: id
    }
  });
}
