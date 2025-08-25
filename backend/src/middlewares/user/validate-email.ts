import { Request, Response, NextFunction } from 'express';
import prisma from '../../prisma/client';

export const validateEmailUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ error: 'Email é obrigatório!' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
        where: { 
            email: email 
        },
    });

    if (user) {
        res.status(400).json({ error: 'Email já cadastrado!' });
        return;
    }

    next();
  } catch (error) {
    console.error('Erro ao validar o e-mail:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

/*Email is required
Email already in use
Error validating email:
Internal server error*/

export const checkEmailExists = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  
  //Se não houver email no body, passa direto (permitindo atualização de outros campos)
  if (!email) {
    return next();
  }

  try {
    const user = await prisma.user.findUnique({
        where: { 
            email: email 
        },
    });

    if (user) {
        res.status(400).json({ error: 'Email já cadastrado!' });
        return;
    }
    next();
    
  } catch (error) {
    console.error('Erro ao verificar email:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }

};