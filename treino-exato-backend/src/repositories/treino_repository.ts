import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export const TreinoRepository = {
    
    findExerciciosByAgenda: async (agendaId: string) => {
        // Consulta no supabase
        const { data, error } = await supabase
            .from('treino_exercicio')
            .select('*')
            .eq('id_treino', agendaId);

        if (error) throw new Error('Erro ao buscar exercícios');
        
        // Retorna lista ou array de exercicios []
        return data || [];
    },

    buscarTreinosModelo: async (cpfPersonal: string) => {
        const { data, error } = await supabase
            .from('treino')
            .select('id, nome_treino, descricao_treino')
            .eq('cpf_personal', cpfPersonal);
            
        if (error) throw error;
        return data;
    },

    cadastrarNovoTreino: async (idAluno: string, idTreino: number, cpfPersonal: string, nomeAgenda: string) => {
        const { error } = await supabase
            .from('agenda')
            .insert({ 
                nome_agenda: nomeAgenda, 
                cpf_personal: cpfPersonal, 
                cpf_aluno: idAluno, 
                id_treino: idTreino 
            });
            
        if (error) throw error;
    }
};