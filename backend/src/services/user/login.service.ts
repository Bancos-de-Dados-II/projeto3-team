import prisma from "../../prisma/client";
import { User } from "../../@types/user";
import { comparePassword } from "../../utils/hash.util";

export async function loginService(email: string, password: string): Promise<Omit<User, "password"> | null>  {
    const user = await prisma.user.findUnique({
        where: { email }
    })

     if (!user) {
        console.log('Usuário não encontrado com o email:', email);
        return null;
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) return null;

    // remove a senha antes de retornar
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}