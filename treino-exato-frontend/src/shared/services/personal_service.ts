import type { AlunoDTO } from "../utils/DTO";
import api from './api';

export const carregarAlunos = async (token: string, idPersonal: string): Promise<AlunoDTO[]> => {
    console.log(idPersonal);
    const response = await api.get(`/personal/dashboard/${idPersonal}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;

    /* dados mockados para teste
    return [
        { id: '1', nome: 'Aluno Um', foto: undefined },
        { id: '2', nome: 'Aluno Dois', foto: undefined },
        { id: '3', nome: 'Aluno Três', foto: undefined },
        { id: '4', nome: 'Aluno Quatro', foto: undefined },
        { id: '5', nome: 'Aluno Cinco', foto: undefined },
        { id: '6', nome: 'Aluno Seis', foto: undefined },
        { id: '7', nome: 'Aluno Sete', foto: undefined },
        { id: '8', nome: 'Aluno Oito', foto: undefined },
        { id: '9', nome: 'Aluno Nove', foto: undefined },
    ];*/ 
};

export const carregarPerfilAluno = async (idAluno: string, token: string): Promise<AlunoDTO> => {
    const response = await api.get(`/personal/dashboard/buscarAlunos/${idAluno}`, {
        headers: {
            Authorization: `Bearer ${token}`
            }
        });
    return response.data;

    // dados mockados para teste
    //return { id: idAluno, nome: 'Aluno Teste', foto: undefined };
};
