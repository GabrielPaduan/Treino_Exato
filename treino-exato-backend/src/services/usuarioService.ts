import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import type { LoginDTO } from '../types/DTO.js';

import { buscarUsuarioPorEmail } from '../repositories/usuarioRepository.js';

import { buscarAlunoPorCPF } from '../repositories/alunoRepository.js';

import { buscarPersonalPorCPF } from '../repositories/personalRepository.js';

export async function autenticarUsuario(
    loginData: LoginDTO
) {

    const usuario = await buscarUsuarioPorEmail(loginData.login);

    if(!usuario){
        throw new Error('Usuário não encontrado');
    }
    
    const senhaCorreta = await bcrypt.compare(loginData.senha, usuario.password_hash);

    if(!senhaCorreta){
        throw new Error('Senha inválida');
    }
    
    let role = 'ALUNO';

    const aluno = await buscarAlunoPorCPF(usuario.cpf);

    if(aluno){
        role = 'ALUNO';
    }

    const personal = await buscarPersonalPorCPF(usuario.cpf);

    if(personal){
        role = 'PERSONAL';
    }

    const token = jwt.sign(
        {
            cpf: usuario.cpf,
            nome: usuario.nome,
            email: usuario.email,
            role
        },
        process.env.JWT_SECRET_KEY as string,
        {
            expiresIn: '1d'
        }
    );

    return token;
}