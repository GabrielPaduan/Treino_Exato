import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export class TreinoRepository {
    async findExerciciosByAgenda(agendaId: string) {
        // Consulta no supabase
        const { data, error } = await supabase
            .from('treino_exercicio')
            .select('*')
            .eq('id_treino', agendaId);

        if (error) throw new Error('Erro ao buscar exercícios');
        
        // Retorna lista ou array de exercicios []
        return data || [];
    }
}
