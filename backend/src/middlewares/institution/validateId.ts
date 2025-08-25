import { Request, Response, NextFunction } from "express";
import { getSession } from "../../database/neo4j";

export const validateId = async (req: Request, res: Response, next: NextFunction) => {
  const session = getSession();
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "ID da instituição não informado" });
      return;
    }

    const result = await session.run(
      'MATCH (i:Institution {id: $id}) RETURN i',
      { id }
    );

    if (result.records.length === 0) {
      res.status(404).json({ error: "Instituição não encontrada" });
      return;
    }
    next();
  } catch (error) {
    console.error("Erro ao validar id da instituição:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  } finally {
    await session.close();
  }
};