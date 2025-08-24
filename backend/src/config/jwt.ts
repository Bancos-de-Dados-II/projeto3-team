// Configuração inicial do JWT

// if para verificar se a variável de ambiente JWT_SECRET está definida
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET não definida');
}

export const jwtConfig = {
    secret: process.env.JWT_SECRET,
    expiresIn: '4h',
}