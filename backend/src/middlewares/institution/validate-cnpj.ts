import { Request, Response, NextFunction } from "express";
import { getSession } from "../../database/neo4j";

export const validateCnpj = async (req: Request, res: Response, next: NextFunction) => {
  const session = getSession();
  try {
    const { cnpj } = req.body;
    
    const result = await session.run(
      'MATCH (i:Institution {cnpj: $cnpj}) RETURN i',
      { cnpj }
    );

    if (result.records.length > 0) {
      res.status(400).json({ error: "CNPJ já cadastrado" });
      return;
    }
    
    next();
  } catch (error) {
    console.error("Erro ao validar cnpj da instituição:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  } finally {
    await session.close();
  }
};