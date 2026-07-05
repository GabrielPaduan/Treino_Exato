import supabase from "../config/supabase.js";

export class AgendaService {
    async buscarAgendaDoDia(alunoId: string): Promise<string | null> {
        // Pega o dia de hoje
        const hoje = new Date().toISOString().split('T');
        // Busca no supabase na tabela de agendas
        const { data, error } = await supabase
            .from('agenda')
            .select('id_treino')
            .eq('cpf_aluno', alunoId)
            .order('id_treino', { ascending: true }) 
            .limit(1)                         
            .maybeSingle();
        
        // Se nao houver agenda, retorna nulo
        if (error || !data) return null;
        
        // Retorna o id da agenda
        return data.id_treino;
    }
}
