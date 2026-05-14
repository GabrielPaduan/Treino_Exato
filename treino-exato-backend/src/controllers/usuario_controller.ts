import express from 'express';
import * as UserRepository from '../repository/usuario_repositorio.js';
import * as agendaService from '../services/agenda_service.js';

// Função para obter a agenda do dia e os exercícios relacionados para um aluno específico,
// que será chamada quando receber uma requisição para buscar a agenda do dia de um aluno específico.
export const getDashboardAluno = async (req: express.Request, res: express.Response) => {
    // 1: Extrai o ID do aluno dos parâmetros da requisição, 
    // que é necessário para buscar a agenda e os exercícios relacionados.
    const { alunoId } = req.params;
 

    // 2: Consulta a agenda do dia para o aluno usando o Service, 
    // e depois busca os exercícios relacionados a essa agenda.
    try{
        // 2.1: Busca a agenda do dia para o aluno usando o Service, que por sua vez chama o Repository para acessar o banco de dados.
        const agenda = await agendaService.buscarAgendaDoDia(Number(alunoId));

        // 2.2: Verifica se a agenda foi encontrada. 
        // Se não for encontrada, retorna um erro 404 Not Found para o cliente, indicando que não há agenda para o dia de hoje.
        if(!agenda || !agenda.id) return res.status(404).json({ error: "Nenhuma agenda encontrada para o dia de hoje." });

        // 2.3: Busca os exercícios relacionados à agenda encontrada.
        const exercicios = await UserRepository.findExerciciosByAgenda(agenda.id);

        // 2.4: Verifica se há exercícios relacionados.
        // Se houver exercícios, retorna um status 200 OK com os exercícios em formato JSON.
        // Se não houver exercícios, retorna um status 200 OK com um array vazio, indicando que a agenda do dia existe mas não tem exercícios relacionados.
        if(exercicios && exercicios.length > 0) return res.status(200).json(exercicios);
        else                                    return res.status(200).json([]);

    }
    
    // 3: Se ocorrer qualquer erro durante o processo (como falha no banco de dados, etc), 
    // ele é capturado aqui e retorna um status 500 Internal Server Error com a mensagem de erro.
    catch(error: any) {res.status(500).json({ error: error.message })};
};