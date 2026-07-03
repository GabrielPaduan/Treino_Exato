import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export type UserRole = 'ALUNO' | 'PERSONAL' | 'ADMIN';

export interface TokenPayload {
  sub: string;
  name: string;
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

export const verifyToken = (req: Request, _res: Response, next: NextFunction) => {
  req.user = { sub: 'BYPASS', name: 'Teste', email: 't@t.com', role: 'PERSONAL' };
  return next();
  // ---- bypass ativo; codigo original abaixo desativado ----
  // eslint-disable-next-line no-unreachable
  // const authHeader = req.headers['authorization'];
  // const token = authHeader?.split(' ')[1];
  // if (!token) {
  //   return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  // }
  // try {
  //   const secret = process.env.JWT_SECRET;
  //   if (!secret) throw new Error("JWT_SECRET não está configurado.");
  //   const decoded = jwt.verify(token, secret) as TokenPayload;
  //   req.user = decoded;
  //   next();
  // } catch (error) {
  //   return res.status(401).json({ message: 'Sessão expirada ou token inválido.' });
  // }
  next();
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
