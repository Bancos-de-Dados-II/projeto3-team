import prisma from "../../prisma/client";

export async function updateLocalizationInstitutionService(id: string, positionX: number, positionY: number): Promise<void> {
    await prisma.instituicao.update({ where: { id }, data: { localization: { type: "Point", coordinates: [positionX, positionY] } } });

}