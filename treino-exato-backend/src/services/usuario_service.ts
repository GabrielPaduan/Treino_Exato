/** Importações de bibliotecas externas necessárias para o serviço de usuário.
 * 
 * bcrypt é uma biblioteca para hashing de senhas, 
 * usada para comparar a senha fornecida pelo usuário com a senha armazenada no banco de dados.
 * 
 * jwt é uma biblioteca para criação e verificação de tokens JWT (JSON Web Tokens), 
 * usada para gerar tokens de autenticação para usuários autenticados.
 */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/** Importações de tipos e funções necessárias para o serviço de usuário.
 * 
 * LoginDTO é uma interface que define a estrutura dos dados de login recebidos na requisição.
 * 
 * buscarUsuarioPorEmail é uma função do repositório de usuário que busca um usuário no banco de dados pelo email.
 * buscarAlunoPorCPF     é uma função do repositório de aluno que busca um aluno no banco de dados pelo CPF.
 * buscarPersonalPorCPF  é uma função do repositório de personal trainer que busca um personal trainer no banco de dados pelo CPF.
 */
import type { LoginDTO } from '../types/DTO.js';
import { buscarUsuarioPorEmail } from '../repositories/usuario_repository.js';
import { buscarAlunoPorCPF } from '../repositories/aluno_repository.js';
import { buscarPersonalPorCPF } from '../repositories/personal_repository.js';

/** Função responsável por autenticar um usuário com base nos dados fornecidos.
 * 
 * Recebe os dados de login (email e senha), busca o usuário correspondente no banco de dados,
 * verifica se a senha fornecida corresponde à senha armazenada e, se a autenticação for bem-sucedida,
 * gera um token JWT contendo informações do usuário e seu papel (role).
 * 
 * @param loginData Objeto contendo os dados de login (email e senha) fornecidos pelo usuário
 * @return          Token JWT se a autenticação for bem-sucedida. Lança um erro caso contrário
*/
export async function autenticarUsuario(loginData: LoginDTO){
    // 1: Busca o usuário no banco de dados pelo email fornecido
    const usuario = await buscarUsuarioPorEmail(loginData.login);
    // 1.1: Se o usuário não for encontrado, lança um erro indicando que o usuário não foi encontrado
    if(!usuario) {throw new Error('Usuário não encontrado');}
    
    // 2: Compara a senha fornecida pelo usuário com a senha armazenada no banco de dados usando bcrypt
    const senhaCorreta = await bcrypt.compare(loginData.senha, usuario.password_hash);
    // 2.1: Se a senha não corresponder, lança um erro indicando que a senha é inválida
    if(!senhaCorreta) {throw new Error('Senha inválida');}
    
    // 3: Inicializa a variável role com o valor 'ALUNO' por padrão
    let role = 'ALUNO';

    // 4: Busca o aluno correspondente ao usuário autenticado pelo CPF
    const aluno = await buscarAlunoPorCPF(usuario.cpf);
    // 4.1: Se o aluno for encontrado, define o papel (role) como 'ALUNO'
    if(aluno) {role = 'ALUNO';}
    // 4.2: Usuáio não é aluno, então verifica se é personal trainer
    else{
        // 4.2.1: Busca o personal trainer correspondente ao usuário autenticado pelo CPF
        const personal = await buscarPersonalPorCPF(usuario.cpf);
        // 4.2.2: Se o personal trainer for encontrado, define o papel (role) como 'PERSONAL'
        if(personal) role = 'PERSONAL';
        // 4.2.3: Se o usuário não for nem aluno nem personal trainer, 
        // lança um erro indicando que o usuário não possui papel definido
        else throw new Error('Usuário não possui papel definido');
    }

    // 5: Gera um token JWT contendo informações do usuário e seu papel (role)
    const token = jwt.sign({
            cpf: usuario.cpf,
            nome: usuario.nome,
            email: usuario.email,
            role
        },
        process.env.JWT_SECRET_KEY as string,{expiresIn: '1d'}
    );

    // 6: Retorna o token JWT gerado, que será usado para autenticação em requisições subsequentes
    return token;
}