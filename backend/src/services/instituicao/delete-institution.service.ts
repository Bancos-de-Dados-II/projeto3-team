import { deleteInstitutionNeo4j } from "./neo4j/neo4jInstitutionService";
import prisma from "../../prisma/client";
export async function deleteInstitutionService(id: string): Promise<void> {
  await prisma.instituicao.delete({
    where: {
      id: id
    }
  });
  await deleteInstitutionNeo4j(id);
}