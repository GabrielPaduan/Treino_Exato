/** Importações de tipos e serviços para o módulo de autenticação do usuário.
 * 
 * LoginDTO: Tipo de dados para login do usuário.
 * LoginResponse: Tipo de dados para a resposta do login do usuário.
 * 
 * api: Serviço de API para realizar requisições HTTP.
 */
import type { LoginDTO, LoginResponse } from "../utils/DTO";
import api from './api';

/** Função para realizar o login do usuário.
 * Esta função envia uma requisição POST para o endpoint de login da API, utilizando os dados fornecidos pelo usuário.
 * 
 * @param loginData Dados de login do usuário.
 * @returns         Uma promessa que resolve para a resposta do login.
 */
export const loginUser = async (loginData: LoginDTO): Promise<LoginResponse> => {
    /** 1: Envia uma requisição POST para o endpoint '/auth/login' da API, passando os dados de login do usuário.
     * 
     * await:        A função aguarda a resposta da API antes de continuar a execução do código.
     * api:          Serviço de API utilizado para realizar a requisição HTTP.
     * post:         Método HTTP utilizado para enviar os dados de login para o servidor.
     * response:     Variável que armazena a resposta da API, que contém o token de autenticação do usuário.
     * 'auth/login': Endpoint da API para autenticação do usuário.
     */
    const response = await api.post<{ response: LoginResponse }>('/auth/login/teste', loginData);

    // 2: Retorna a resposta da API, que contém o token de autenticação do usuário.
    return response.data.response;
};