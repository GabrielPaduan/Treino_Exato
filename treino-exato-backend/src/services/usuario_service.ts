import * as UserRepository from '../repository/usuario_repositorio.js';
import type { TreinoDTO } from '../types/DTO.js';

// 1: Função para obter os dias de treino de um aluno específico, 
// que será chamada pelo Controller quando receber uma requisição para buscar os treinos de um aluno específico.
export const getDiasDeTreino = async (id: number): Promise<TreinoDTO[] | null> => {
    // 1.1: Valida o ID do aluno para garantir que é um número válido. 
    // Se não for, lança um erro para que o Controller possa lidar com isso.
    if(!id || isNaN(id)) throw new Error("O ID do aluno é obrigatório e deve ser um número válido.");

    // 1.2: Pede os dados brutos ao Repository
    const treinos = await UserRepository.getTreinoByIDFromDB(id);

    // 1.3: Se o Repository retornar null, significa que não encontramos treinos para esse aluno, então lançamos um erro para que o Controller possa lidar com isso.
    if(treinos === null) throw new Error("Nenhum treino encontrado para este aluno.");

    // 1.4: Se tudo der certo, retornamos os treinos encontrados para o Controller, que irá enviar a resposta para o cliente.
    return treinos;
};