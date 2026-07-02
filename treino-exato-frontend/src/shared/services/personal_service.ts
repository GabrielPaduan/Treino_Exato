import type { AlunoDTO } from "../utils/DTO";
import api from './api';

export const carregarAlunos = async (): Promise<AlunoDTO[]> => {
    //const response = await api.get('/api/personal/dashboard');
    //return response.data;

    // dados mockados para teste
    return [
        { id: '1', nome: 'Aluno Um', foto: undefined },
        { id: '2', nome: 'Aluno Dois', foto: undefined },
        { id: '3', nome: 'Aluno Três', foto: undefined },
    ]; 
};

export const carregarPerfilAluno = async (idAluno: string): Promise<AlunoDTO> => {
    //const response = await api.get(`/api/personal/dashboard/${idAluno}`);
    //return response.data;

    // dados mockados para teste
    return { id: idAluno, nome: 'Aluno Teste', foto: undefined };
};
