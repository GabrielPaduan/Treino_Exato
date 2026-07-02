import supabase from "../config/supabase.js";

export class AgendaService {
    async buscarAgendaDoDia(alunoId: string): Promise<string | null> {
        // APENAS PARA TESTE
        if (alunoId === 'aluno-teste-123') {
            return 'agenda-fake-001'; 
        }
        //

        // Pega o dia de hoje
        const hoje = new Date().toISOString().split('T');

        // Busca no supabase na tabela de agendas
        const { data, error } = await supabase
            .from('agendas')
            .select('id')
            .eq('aluno_id', alunoId)
            .eq('data', hoje)
            .single();

        // Se nao houver agenda, retorna nulo
        if (error || !data) return null;
        
        // Retorna o id da agenda
        return data.id;
    }
}
