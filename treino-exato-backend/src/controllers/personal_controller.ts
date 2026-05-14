import express from 'express';
import * as personalService from '../services/personal_service.js';

// 1: Função para obter a dashboard do personal trainer, que inclui a lista de alunos vinculados a ele.
// Esta função será chamada quando receber uma requisição para buscar a dashboard do personal trainer.
export const getDashboardPersonal = async (req: express.Request, res: express.Response) => {
    // 1.1: Extrai o ID do personal dos parâmetros da requisição, que é necessário para buscar os alunos vinculados a ele.
    const { idPersonal } = req.params;

    // 1.2: Consulta os alunos vinculados ao personal trainer usando o Service, 
    // e depois retorna a lista de alunos encontrados.
    try {
        // 1.2.1: Busca os alunos vinculados ao personal trainer usando o Service, 
        // que por sua vez chama o Repository para acessar o banco de dados.
        const alunos = await personalService.buscarAlunos(Number(idPersonal));

        // 1.2.2: Retorna a lista de alunos encontrados em formato JSON com status 200 OK.
        return res.status(200).json(alunos);
    } 
    
    // 1.3: Se ocorrer qualquer erro durante o processo (como falha no banco de dados, etc), 
    // ele é capturado aqui e retorna um status 500 Internal Server Error com a mensagem de erro.
    catch(error: any) {return res.status(500).json({ error: error.message })};
};