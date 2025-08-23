import { Request, Response, NextFunction } from "express";
import prisma from "../../prisma/client";

export const validateId = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "ID da instituição não informado" });
      return;
    }

    const institution = await prisma.instituicao.findUnique({
      where: { id: id },
    });

    if (!institution) {
      res.status(404).json({ error: "Instituição não encontrada" });
      return;
    }
    next();

  } catch (error) {
    console.error("Erro ao validar id da instituição:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
    return;
  }
};
