import { User } from "../@types/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Função para gerar um hash de senha usando bcrypt
export const createPasswordHash = async (password: string): Promise<string> => {
    const saltRounds = 10; // Número de rounds para o salt
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

// Função para comparar uma senha com um hash
export const comparePassword = async (password: string, passwordHash: string): Promise<boolean> => {
    const isValid = await bcrypt.compare(password, passwordHash);
    return isValid;
}

// Função para gerar um token JWT
export const generateToken = (user: User): string => {
    return jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "3h" } // O token expira em 3 hora
    );
}
