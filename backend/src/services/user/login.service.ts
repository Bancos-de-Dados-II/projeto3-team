import prisma from "../../prisma/client";
import { User } from "../../@types/user";
import { comparePassword } from "../../utils/hash.util";

export async function loginService(email: string, password: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
        where: { email }
    })

     if (!user) {
        console.log('Usuário não encontrado com o email:', email);
        return null;
    }

    const isPasswordValid = await comparePassword(password, user.password);
    return isPasswordValid ? user : null;

}