import prisma from "../../prisma/client";
import { InstitutionGet } from "../../@types/instituicao";

export async function getInstitutionService(): Promise<InstitutionGet[]> {
  const institutions = await prisma.instituicao.findMany();
  return institutions;
}
