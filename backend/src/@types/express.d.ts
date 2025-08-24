import { User, Role } from '@prisma/client';

interface JwtPayload {
  id: string;
  name: string;
  email: string;
  role: Role;
}

declare global {
  namespace Express {
    interface User {
        role: Role;
    }
    interface Request {
      user?: JwtPayload;
    }
  }
}

