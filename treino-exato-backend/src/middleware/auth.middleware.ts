import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export type UserRole = 'ALUNO' | 'PERSONAL' | 'ADMIN';

export interface TokenPayload {
  cpf: string;
  nome: string;
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
} 

// 3. Middleware de Autenticação (Verifica se está logado)
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) throw new Error("JWT_SECRET_KEY não está configurado.");

    const decoded = jwt.verify(token, secret) as TokenPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Sessão expirada ou token inválido.' });
  }
};

export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Acesso negado. Usuário não autenticado.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Acesso negado. Privilégios insuficientes para acessar este recurso.' 
      });
    }
    next();
  };
};
