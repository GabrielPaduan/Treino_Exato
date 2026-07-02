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
                    id,
                    nome,
                    foto
                )
            )
        `)
        .eq('personal_id', personalId)
        .eq('status', 'ATIVO');
 
    if (error) {
        throw error;
    }
 
    return (data as any[]).map((item: any) => {
    const usuario = item.aluno?.[0]?.usuario?.[0];
    if (!usuario) 
        return null;

    return {
        id: usuario.id,
        nome: usuario.nome,
        foto: usuario.foto ?? undefined,
    };
}).filter(Boolean);
};
 
export const obterPerfilAluno = async (personalId: string, idAluno: string) => {
    const { data, error } = await supabase
        .from('vinculo_personal_aluno')
        .select(`
            aluno (
                usuario (
                    id,
                    nome,
                    foto
                )
            )
        `)
        .eq('personal_id', personalId)
        .eq('aluno_id', idAluno)
        .eq('status', 'ATIVO')
        .single();
 
    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }
 
    const usuario = (data as any).aluno?.[0]?.usuario?.[0];
    if (!usuario) 
        return null;
 
    return {
        id: usuario.id,
        nome: usuario.nome,
        foto: usuario.foto ?? undefined,
    };
};