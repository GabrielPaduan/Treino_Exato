import * as AgendaRepository from '../repository/agenda_repositorio.js';

// 1: Função para buscar a agenda do dia de um aluno específico,
// que será chamada pelo Controller quando receber uma requisição para buscar a agenda do dia de um aluno específico.
export const buscarAgendaDoDia = async (alunoId: number) => {
    // 1.1: Valida o ID do aluno para garantir que é um número válido. 
    // Se não for, lança um erro para que o Controller possa lidar com isso.
    if(!alunoId || isNaN(alunoId)) throw new Error("O ID do aluno é obrigatório e deve ser um número válido.");

    // 1.2: Pega a data de hoje no formato YYYY-MM-DD para usar na consulta.
    const hoje = new Date().toISOString().split('T')[0]!;

    // 1.3: Pede os dados brutos ao Repository, que irá consultar o banco de dados e retornar a agenda do dia para o aluno.
    return await AgendaRepository.findAgendaByDate(alunoId, hoje);
};