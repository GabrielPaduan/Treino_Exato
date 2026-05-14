import api from './api';

export interface Aluno {
    cpf_usuario: string;
    descricao_lesao: string | null;
    usuario: {
        cpf: string;
        nome: string;
        email: string;
    };
}

export interface TreinoModelo {
    id: number;
    nome_treino: string;
    descricao_treino: string;
}

export interface AssociarTreinoDTO {
    cpfAluno: string;
    idTreino: number;
    nomeAgenda?: string;
    diaSemana?: string;
}

export const TreinoService = {
    listarAlunos: async (): Promise<Aluno[]> => {
        const { data } = await api.get('/alunos');
        return data;
    },

    buscarAlunoPorCpf: async (cpf: string): Promise<Aluno> => {
        const { data } = await api.get(`/alunos/${cpf}`);
        return data;
    },

    listarTreinosModelo: async (): Promise<TreinoModelo[]> => {
        const { data } = await api.get('/treinos/modelos');
        return data;
    },

    associarTreino: async (dto: AssociarTreinoDTO): Promise<void> => {
        await api.post('/treinos/associar', dto);
    },
};
