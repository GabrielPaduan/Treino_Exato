// Importa a instância do Supabase configurada para interagir com o banco de dados
import supabase from '../config/supabase.js';
import type { User } from '../types/DTO.js';

/** Função responsável por buscar um usuário no banco de dados pelo email fornecido.
 * 
 * Recebe um email como parâmetro, realiza uma consulta no banco de dados usando o Supabase
 * para encontrar um usuário com o email correspondente e retorna os dados do usuário se encontrado.
 * 
 * @param email Email do usuário a ser buscado no banco de dados
 * @returns     Dados do usuário encontrado se houver correspondência. Lança um erro caso contrário
 */
export async function buscarUsuarioPorEmail(email: string): Promise<User>{
    /** 1: Realiza uma consulta no banco de dados usando o Supabase para buscar um usuário com o email fornecido.
     * 
     * A consulta seleciona todos os campos da tabela 'usuario' 
     * e filtra os resultados para encontrar um registro com o email correspondente. 
     * 
     * A função retorna os dados do usuário encontrado ou lança um erro caso não haja correspondência.
     * 
     * 'from':   Especifica a tabela do banco de dados a ser consultada, neste caso, a tabela 'usuario';
     * 'select': Define os campos a serem retornados na consulta, neste caso, todos os campos ('*');
     * 'eq':     Filtra os resultados para encontrar um registro com o email correspondente.
     * 'single': Indica que a consulta deve retornar apenas um registro, caso haja correspondência.
     * 
     * @param data  Dados do usuário encontrado no banco de dados, caso haja correspondência
     * @param error Objeto de erro retornado pelo Supabase caso ocorra algum problema na consulta
     * @param email Email do usuário a ser buscado no banco de dados, fornecido como parâmetro da função
     * @returns     Dados do usuário encontrado se houver correspondência. Lança um erro caso contrário
     */
    const { data, error } = await supabase
        .from('usuario')
        .select('*')
        .eq('email', email)
        .single();
    // 2: Verifica se ocorreu algum erro durante a consulta ao banco de dados.
    if(error) {throw error;}

    // 3: Retorna os dados do usuário encontrado no banco de dados, caso haja correspondência.
    return data;
}