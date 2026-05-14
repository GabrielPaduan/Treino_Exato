import * as PersonalRepository from '../repository/personal_repository.js';
import type { AlunoDTO } from '../types/DTO.js';

// 1: Função para buscar os alunos vinculados a um personal trainer específico pelo ID do personal trainer.
// Esta função será chamada pelo Controller quando receber uma requisição para buscar os alunos vinculados a um personal trainer específico.
export const buscarAlunos = async (idPersonal: number): Promise<AlunoDTO[]> => {
    // 1.1: Valida o ID do personal para garantir que é um número válido.
    // Se não for, lança um erro para que o Controller possa lidar com isso.
    if(!idPersonal || isNaN(idPersonal)) throw new Error("O ID do personal é obrigatório e deve ser um número válido.");

    // 1.2: Pede os dados brutos ao Repository
    const alunos = await PersonalRepository.obterAlunosVinculados(idPersonal);

    // 1.3: Retorna a lista de alunos encontrados.
    return alunos;
};