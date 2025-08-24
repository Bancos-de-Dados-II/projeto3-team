import { Request, Response } from "express";
import { registerUserService } from "../../services/user/register-user.service";
import { Role } from "@prisma/client";

// Controlador para registrar um novo usuário
export const registerUserController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ error: "Todos os campos são obrigatórios" });
            return;
        }

        const user = await registerUserService( name, email, password );
        res.status(201).json({ mensagem: "Usuário cadastrado", usuario: { nome: user.name, email: user.email, role: user.role } });
        
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
        
    }
}