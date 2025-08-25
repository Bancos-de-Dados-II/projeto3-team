import { Request, Response } from "express";
import { listUsersService } from "../../services/user/list-users.service";

export const listUsersController = async (req: Request, res: Response) => {
    try {
        const users = await listUsersService();
        res.status(200).json(users);
        return;
    } catch (error) {
        console.error("Erro ao listar usuários:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
        return;
    }
};