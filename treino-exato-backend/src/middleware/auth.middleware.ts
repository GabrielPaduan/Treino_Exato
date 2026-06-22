import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

// 1. Tipagens centralizadas (Mesmas do Frontend)
export type UserRole = 'ALUNO' | 'PERSONAL' | 'ADMIN';

export interface TokenPayload {
  sub: string;   // ID do usuário no banco (UUID)
  name: string;
  email: string;
  role: UserRole;
}

// 2. Estendendo o Request do Express para aceitar o nosso usuário
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
  
  // Extrai o token do formato "Bearer <token>"
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET não está configurado.");

    // Decodifica e tipa o payload
    const decoded = jwt.verify(token, secret) as TokenPayload;
    
    // Anexa o usuário à requisição atual
    req.user = decoded; 
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Sessão expirada ou token inválido.' });
  }
};

// 4. Middleware de Autorização (Verifica a Role)
export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    
    if (!req.user) {
      return res.status(401).json({ message: 'Acesso negado. Usuário não autenticado.' });
    }

    // Verifica se a role do usuário (ex: ALUNO) está dentro do array de roles permitidas
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Acesso negado. Privilégios insuficientes para acessar este recurso.' 
      });
    }

    next();
  };
};