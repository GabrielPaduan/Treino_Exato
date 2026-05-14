import supabase from '../config/supabase.js';
import type { AlunoDTO } from '../types/DTO.js'; // Ajuste o caminho/nome do DTO conforme necessário

// 1: Função para obter os alunos vinculados a um personal trainer específico pelo ID do personal trainer.
// Esta função será chamada pelo Controller quando receber uma requisição para buscar os alunos vinculados a um personal trainer específico.
export const obterAlunosVinculados = async (idPersonal: number): Promise<AlunoDTO[]> => {
    // 1.1: Consulta ao banco de dados para obter os alunos vinculados ao personal trainer especificado pelo ID.
    const { data, error } = await supabase
        .from('Alunos') // Substituir pelo nome correto
        .select('*')
        .eq('personal_id', idPersonal); 

    // 1.2: Verificação de erros na consulta e lançamento de exceção se houver algum erro.
    if(error) throw error;
    
    // 1.3: Retorno dos dados obtidos, convertendo-os para o tipo AlunoDTO. Se não houver dados, retorna um array vazio.
    // Se data for null ou undefined, ele retorna null para evitar erros de null/undefined no Controller.
    return (data as AlunoDTO[]) || null;
};