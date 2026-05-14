import type { Request, Response } from 'express';

import type { LoginDTO, LoginResponse } from '../types/DTO.js';

import { autenticarUsuario } from '../services/usuarioService.js';

export async function login(req: Request, res: Response) {

    const { login, senha }: LoginDTO = req.body;

    if (!login || !senha) {
        return res.status(400).json({
            message: 'Email e senha obrigatórios'
        });
    }

    try {
        const token = await autenticarUsuario({
            login,
            senha
        });

        const response: LoginResponse = { token };

        return res.json({ response });

    } catch (error: any) {
        return res.status(401).json({
            message: error.message
        });
    }
}