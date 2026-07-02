import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export class TreinoRepository {
    async findExerciciosByAgenda(agendaId: string) {
        // APENAS PARA TESTE
        if (agendaId === 'agenda-fake-001') {
            return [
                { id: 'ex1', nome: 'Supino Reto', series: 3, repeticoes: '12' },
                { id: 'ex2', nome: 'Agachamento', series: 4, repeticoes: '10' }
            ];
        }
        //

        // Consulta no supabase
        const { data, error } = await supabase
            .from('exercicios')
            .select('*')
            .eq('agenda_id', agendaId);

        if (error) throw new Error('Erro ao buscar exercícios');
        
        // Retorna lista ou array de exercicios []
        return data || [];
    }
}
