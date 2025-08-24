import { Request, Response } from "express";
import { createInstitutionService } from "../../services/instituicao/create-institution.service";

export const createInstitutionController = async ( req: Request, res: Response ) => {
  try {
    const { name, cnpj, contact, description, positionX, positionY } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Usuário não autenticado' });
      return;
    }

    if (
      !name ||
      !cnpj ||
      !contact ||
      !description ||
      !positionX ||
      !positionY
    ) {
      res.status(400).json({ error: "Preencha todos os campos" });
      return;
    }

    await createInstitutionService({
      name,
      cnpj,
      contact,
      description,
      positionX,
      positionY,
      }, userId 
    );

    res.status(201).json({ message: "Instituição criada com sucesso!" });
    return;
  } catch (error) {
    console.error("Erro ao criar instituição:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
    return;
  }
};
