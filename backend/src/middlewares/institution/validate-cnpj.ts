import { Request, Response, NextFunction } from "express";
import prisma from "../../prisma/client";

export const validateCnpj = async (req: Request, res: Response, next: NextFunction ) => {
  try {
    const { cnpj } = req.body;
    
    const institution = await prisma.instituicao.findFirst({
      where: { cnpj },
    });

    if (institution) {
      res.status(400).json({ error: "CNPJ já cadastrado" });
      return;
    }
    
    next();
  } catch (error) {
    console.error("Erro ao validar cnpj da instituição:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};
