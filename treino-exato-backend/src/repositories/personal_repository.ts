import supabase from '../config/supabase.js';

export async function buscarPersonalPorCPF(
    cpf: string
) {
    const { data, error } = await supabase.from('personal_trainer').select('*').eq('cpf_usuario', cpf).single();
    if (error) {
        return null;
    }

    return data;
}

export const obterAlunosVinculados = async (personalId: string) => {
    const { data, error } = await supabase
        .from('vinculo_personal_aluno')
        .select(`
            aluno (
                usuario (
                    cpf,
                    nome
                )
            )
        `)
        .eq('cpf_personal', personalId)
        .eq('status', true);
    if (error) {
        throw error;
    }
    return (data as any[]).map((item: any) => {
        const usuario = item.aluno?.usuario; 
        
        if (!usuario) return null;

        return {
            cpf: usuario.cpf,
            nome: usuario.nome
        };
    }).filter(Boolean);
};
 
export const obterPerfilAluno = async (personalId: string, idAluno: string) => {
    const { data, error } = await supabase
        .from('vinculo_personal_aluno')
        .select(`
            aluno (
                usuario (
                    cpf,
                    nome
                )
            )
        `)
        .eq('cpf_personal', personalId)
        .eq('cpf_aluno', idAluno)
        .eq('status', true)
        .single();
 
    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }
 
    const usuario = (data as any).aluno?.usuario; 
    
    if (!usuario) return null;

    return {
        cpf: usuario.cpf,
        nome: usuario.nome
    };
};