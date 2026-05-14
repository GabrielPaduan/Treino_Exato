import supabase from '../config/supabase.js';

export async function buscarUsuarioPorEmail(
    email: string
) {
    const { data, error } = await supabase.from('usuario').select('*').eq('email', email).single();

    if(error){
        throw error;
    }

    return data;
}