import supabase from '../config/supabase.js';
import type { TreinoDTO } from '../types/DTO.js';

// 1: Buscar um treino específico pelo ID, 
// que será chamado pelo Controller quando receber uma requisição para buscar os treinos de um aluno específico.
export const getTreinoByIDFromDB = async (id: number): Promise<TreinoDTO[] | null> => {
    // 1.1: Consulta o banco de dados usando o Supabase para buscar um treino pelo ID.
    // data: contém os dados do treino encontrado, ou null se não encontrar.
    // error: contém informações sobre qualquer erro que possa ter ocorrido durante a consulta.
    const { data, error } = await supabase
        .from('Treinos')
        .select('*')
        .eq('treino_aluno_id', id);

    // 1.2: Se houver um erro na consulta, ele lança uma exceção para que o Controller possa lidar com isso.
    if(error) throw error;

    // 1.3: Se não houver erro, ele retorna os dados. 
    // Se data for null ou undefined, ele retorna null para evitar erros de null/undefined no Controller.
    return (data as TreinoDTO[]) || null;
};

// 2: Buscar os exercícios relacionados a uma agenda específica,
// que será chamado pelo Controller quando receber uma requisição para buscar os exercícios relacionados à agenda do dia de um aluno específico.
export const findExerciciosByAgenda = async (agendaId: number): Promise<TreinoDTO[]> => {
    // 2.1: Consulta o banco de dados usando o Supabase para buscar os exercícios relacionados a uma agenda específica, usando o ID da agenda.
    // data: contém os dados dos exercícios encontrados, ou null se não encontrar.
    // error: contém informações sobre qualquer erro que possa ter ocorrido durante a consulta.
    const { data, error } = await supabase
        .from('Treinos') // No diagrama são chamados de Exercícios
        .select('*')
        .eq('treino_agenda_id', agendaId); // Assumindo que o treino está ligado a uma agenda

    // 2.2: Se houver um erro na consulta, ele lança uma exceção para que o Controller possa lidar com isso.
    if(error) throw error;

    // 2.3: Se não houver erro, ele retorna os dados.
    return (data as TreinoDTO[]) || [];
};