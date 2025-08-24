import { Request, Response } from "express";
import { loginService } from "../../services/user/login.service";
import { generateToken } from "../../utils/hash.util";

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await loginService(email, password);

        if (!user) {
            res.status(401).json({ erro: "Credenciais inválidas" });
            return;
        }
        //console.log(user)
        const token = generateToken(user);
        res.status(200).json({ mensagem: "Login realizado com sucesso", token });
        return;
        
    } catch (error) {
        console.error("Erro ao realizar login:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
        return;
    }
};