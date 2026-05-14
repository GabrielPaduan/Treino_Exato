import supabase from '../config/supabase.js';

export async function buscarPersonalPorCPF(
    cpf: string
) {

    const { data, error } = await supabase.from('personal_trainer').select('*').eq('cpf', cpf).single();

    if (error) {
        return null;
    }

    return data;
}