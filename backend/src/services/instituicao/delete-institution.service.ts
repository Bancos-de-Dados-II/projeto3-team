import prisma from "../../prisma/client";
import { Institution } from "../../@types/instituicao";
import { deleteInstitutionNeo4j } from "./neo4j/neo4jInstitutionService";

export async function deleteInstitutionService(id: string): Promise<void> {
  await prisma.instituicao.delete({
    where: {
      id: id
    }
  });
  await deleteInstitutionNeo4j(id);
}
