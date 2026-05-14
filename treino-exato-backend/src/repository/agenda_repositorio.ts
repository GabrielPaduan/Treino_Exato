import supabase from '../config/supabase.js';
import type { AgendaDTO } from '../types/DTO.js';

// 1: Buscar uma agenda específica pelo ID do aluno e data,
// que será chamada pelo Controller quando receber uma requisição para buscar a agenda do dia de um aluno específico.
export const findAgendaByDate = async (alunoId: number, dataHoje: string): Promise<AgendaDTO | null> => {
    // 1.1: Consulta o banco de dados usando o Supabase para buscar uma agenda pelo ID do aluno e data.
    // data: contém os dados da agenda encontrada, ou null se não encontrar.
    // error: contém informações sobre qualquer erro que possa ter ocorrido durante a consulta.
    const { data, error } = await supabase
        .from('Agendas')
        .select('*')
        .eq('agenda_aluno_id', alunoId)
        .eq('agenda_data', dataHoje)
        .single(); // Esperamos apenas uma agenda por dia

    // 1.2: Se houver um erro na consulta, ele lança uma exceção para que o Controller possa lidar com isso.
    if(error && error.code !== 'PGRST116') throw error; // Ignora erro de "não encontrado"
    
    // 1.3: Se não houver erro, ele retorna os dados. 
    return data;
};