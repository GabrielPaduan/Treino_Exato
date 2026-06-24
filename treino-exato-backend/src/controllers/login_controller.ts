/** Importações de tipos e funções necessárias para o controlador de login.
 * 
 * Request e Response são tipos do Express que representam a requisição e a resposta HTTP, respectivamente.
 * 
 * LoginDTO é uma interface que define a estrutura dos dados de login recebidos na requisição.
 * LoginResponse é uma interface que define a estrutura da resposta de login.
 * 
 * autenticarUsuario é uma função do serviço de usuário que realiza a autenticação do usuário com base nos dados fornecidos.
 */
import type { Request, Response } from 'express';
import type { LoginDTO, LoginResponse } from '../types/DTO.js';
import { autenticarUsuario } from '../services/usuario_service.js';

/** Função responsável por lidar com a requisição de login. 
 * Recebe os dados de login do corpo da requisição, 
 * valida-os e tenta autenticar o usuário chamando a função autenticarUsuario. 
 * Retorna um token JWT se a autenticação for bem-sucedida ou uma mensagem de erro caso contrário.
 * 
 * @param req Objeto de requisição do Express, contendo os dados enviados pelo cliente
 * @param res Objeto de resposta do Express, usado para enviar a resposta da requisição
 * @returns   Resposta JSON contendo o token JWT se a autenticação for bem-sucedida. Uma mensagem de erro caso contrário
 */
export async function login(req: Request, res: Response){

    // 1: Extrai os campos de login e senha do corpo da requisição, 
    // que devem estar no formato definido pela interface LoginDTO
    const { login, senha }: LoginDTO = req.body;

    // 2: Verifica se o email e a senha foram fornecidos na requisição. 
    // Se algum deles estiver ausente, retorna uma resposta de erro com status 400 (Bad Request) 
    // e uma mensagem indicando que ambos são obrigatórios
    if(!login || !senha) return res.status(400).json({message: 'Email e senha obrigatórios'});
    
    // 3: Tenta autenticar o usuário com os dados fornecidos
    try{
        // 3.1: Chama a função autenticarUsuario passando os dados de login e senha,
        // que retorna um token JWT se a autenticação for bem-sucedida
        const token = await autenticarUsuario({login, senha});

        // 3.2: Cria um objeto de resposta contendo o token JWT, conforme definido pela interface LoginResponse
        const response: LoginResponse = { token };

        // 3.3: Retorna uma resposta JSON com o token JWT, indicando que a autenticação foi bem-sucedida
        return res.json({ response });
    } 
    // Se ocorrer algum erro durante a autenticação, 
    // retorna uma resposta de erro com status 401 (Não autorizado) e a mensagem de erro
    catch(error: any) {return res.status(401).json({message: error.message});}
}