import api from './api';

export interface Aluno {
    cpf_usuario: string;
    descricao_lesao: string | null;
    usuario: { cpf: string; nome: string; email: string };
}
export interface TreinoModelo {
    id: number;
    nome_treino: string;
    descricao_treino: string;
}
export interface AssociarTreinoDTO {
    idAluno: string;
    idTreino: number;
}

// baseURL do api ja inclui /api -> aqui os paths vao puros (sem /api).
export const dashboardPersonalService = {
    listarAlunos: async (): Promise<Aluno[]> => (await api.get('treino/alunos')).data,
    buscarAlunoPorId: async (cpf: string): Promise<Aluno> => (await api.get(`treino/alunos/${cpf}`)).data,
    listarTreinosModelo: async (): Promise<TreinoModelo[]> => (await api.get('/treino/modelos')).data,
    associarTreino: async (dto: AssociarTreinoDTO): Promise<void> => { await api.post('/treino/associar', dto); },
};
