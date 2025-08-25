import { Request, Response, NextFunction } from "express";
import { getSession } from "../../database/neo4j";

export const checkInstitutionPermission = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id; // id do Mongo
    const institutionId = req.params.id; // id da instituição no Neo4j

    if (!userId) {
        res.status(401).json({ error: "Usuário não autenticado" });
        return;
    }

    const session = getSession();

    try {
        const result = await session.run(
            `
      MATCH (i:Institution {id: $institutionId})
      WHERE i.userId = $userId
      RETURN i
      `,
            { institutionId, userId }
        );

        if (result.records.length === 0) {
            res.status(403).json({ error: "Você não tem permissão para editar ou remover esta instituição" });
            return;
        }

        next(); // usuário tem permissão
    } catch (error) {
        console.error("Erro ao verificar permissão:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
        return;
    } finally {
        await session.close();
    }
};
