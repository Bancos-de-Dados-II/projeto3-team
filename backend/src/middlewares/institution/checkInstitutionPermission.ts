import { Request, Response, NextFunction } from "express";
import prisma from "../../prisma/client"; 

export const checkInstitutionPermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id; 
  const institutionId = req.params.id; 

  if (!userId) {
    res.status(401).json({ error: "Usuário não autenticado" });
    return;
  }

  try {
    const institution = await prisma.instituicao.findFirst({
      where: {
        id: institutionId,
        createdById: userId, 
      },
    });

    if (!institution) {
      res.status(403).json({
        error: "Você não tem permissão para editar ou remover esta instituição",
      });
      return;
    }

    next();
  } catch (error) {
    console.error("Erro ao verificar permissão:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
    return;
  }
};
