import { Request, Response } from "express";
import { updateInstitutionService } from "../../services/instituicao/update-institution.service";

export const updateInstitutionController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { name, contact, description, positionX, positionY } = req.body;

    if (
      !id ||
      !name ||
      !contact ||
      !description ||
      !positionX ||
      !positionY
    ) {
      res.status(400).json({ error: "Preencha todos os campos" });
      return;
    }
    await updateInstitutionService(id, {
      name,
      contact,
      description,
      positionX,
      positionY,
    });
    res.status(200).json({ message: "Instituição atualizada com sucesso" });
    return;
  } catch (error) {
    console.error("Erro ao atualizar instituição:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
    return;
  }
};
