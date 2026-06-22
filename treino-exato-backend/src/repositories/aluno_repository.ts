import supabase from '../config/supabase.js';

export async function buscarAlunoPorCPF(
    cpf: string
) {

    const { data, error } = await supabase.from('aluno').select('*').eq('cpf', cpf).single();

    if (error) {
        return null;
    }

    return data;
}