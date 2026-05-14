export interface TreinoDTO {
    id: number;
    treino_aluno_id: number;
    treino_diaSemana: string;
    treino_descricao: string;
}

export interface TreinoDTOInsert {
    treino_aluno_id: number;
    treino_diaSemana: string;
    treino_descricao: string;
}

export interface AgendaDTO {
    id: number;
    agenda_aluno_id: number;
    agenda_data: string; // Formato YYYY-MM-DD
}