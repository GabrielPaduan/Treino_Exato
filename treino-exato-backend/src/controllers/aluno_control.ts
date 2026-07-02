import type { Request, Response } from 'express';
import { AgendaService } from '../services/agenda_service.js';
import { TreinoRepository } from '../repositories/treino_repository.js';
import type { AuthRequest } from '../types/DTO.js';

const agendaService = new AgendaService();
const treinoRepository = new TreinoRepository();

export const getDashboard = async (req: Request, res: Response) => {
    const authReq = (req as unknown) as AuthRequest;

    try {
        // Extrai o ID do aluno do token
        const alunoId = authReq.user.id || authReq.user.sub;

        if (!alunoId) {
            return res.status(401).json({ message: "Token inválido: ID ausente" });
        }

        // 1. buscarAgendaDoDia(alunoId) (igual no diagrama de seq)
        const agendaId = await agendaService.buscarAgendaDoDia(alunoId);

        // 2. Bloco alt. (agenda == NULL)
        if (!agendaId) {
            // Retorna 404, disparando o erro "Erro ao carregar lista de exercícios", igual ao diagrama de seq
            return res.status(404).json({ message: "Agenda não encontrada" });
        }

        // 3. Bloco alt. (agenda != NULL)
        const exercicios = await treinoRepository.findExerciciosByAgenda(agendaId);

        // 4. Retorno de Sucesso: 200 OK + Lista
        return res.status(200).json(exercicios);
        
    } catch (error) {
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
};
