import { createClient } from '@supabase/supabase-js';
import type { Exercicio, Agenda } from '../types/DTO.js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const getAlunoDashboard = async (): Promise<Exercicio[]> => {
  // 1. Simula a verificação de token (401 Unauthorized se falhar) [1]
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('401'); 
  }

  const alunoId = session.user.id;

  // 2. buscarAgendaDoDia(alunoId) via agenda_service [1]
  const { data: agenda, error: agendaError } = await supabase
    .from('agendas')
    .select('id')
    .eq('aluno_id', alunoId)
    .eq('data', new Date().toISOString().split('T'))
    .single();

  // Se [agenda == NULL], retorna 404 Not Found [1]
  if (agendaError || !agenda) {
    throw new Error('404');
  }

  // 3. findExerciciosByAgenda(agendaId) via treino_repository [1]
  const { data: exercicios, error: exerciciosError } = await supabase
    .from('exercicios')
    .select('*')
    .eq('agenda_id', agenda.id);

  if (exerciciosError) {
    throw new Error('500'); // Erro genérico para o fluxo de "Erro"
  }

  // Retorna Exercicios[] (pode ser lista vazia conforme o diagrama) [1]
  return exercicios as Exercicio[];
};
