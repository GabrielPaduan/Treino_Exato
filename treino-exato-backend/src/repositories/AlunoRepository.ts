import supabase from '../config/supabase.js';

export const AlunoRepository = {
    buscarTodos: async (cpfPersonal: string) => {
        const { data: vinculos, error: erroVinculo } = await supabase
            .from('vinculo_personal_aluno')
            .select('cpf_aluno')
            .eq('cpf_personal', cpfPersonal)
            .eq('status', 1);
        if (erroVinculo) throw erroVinculo;
        if (!vinculos || vinculos.length === 0) return [];

        const cpfs = vinculos.map((v: { cpf_aluno: string }) => v.cpf_aluno);
        const { data, error } = await supabase
            .from('aluno')
            .select('cpf_usuario, descricao_lesao, usuario(cpf, nome, email)')
            .in('cpf_usuario', cpfs);
        if (error) throw error;
        return data;
    },
    buscarPorId: async (cpf: string) => {
        const { data, error } = await supabase
            .from('aluno')
            .select('cpf_usuario, descricao_lesao, usuario(cpf, nome, email)')
            .eq('cpf_usuario', cpf)
            .single();
        if (error) throw error;
        return data;
    },
};
