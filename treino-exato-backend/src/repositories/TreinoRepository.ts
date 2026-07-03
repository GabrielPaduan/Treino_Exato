import supabase from '../config/supabase.js';

export const TreinoRepository = {
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
            .insert({ nome_agenda: nomeAgenda, cpf_personal: cpfPersonal, cpf_aluno: idAluno, id_treino: idTreino });
        if (error) throw error;
    },
};
