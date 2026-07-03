import type { Request, Response } from 'express';
import { AlunoService } from '../services/AlunoService.js';
import { TreinoService } from '../services/TreinoService.js';

export const listarAlunos = async (req: Request, res: Response) => {
    try {
        const cpfPersonal = req.user?.cpf ?? '';
        const alunos = await AlunoService.listarAlunos(cpfPersonal);
        return res.status(200).json(alunos);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao buscar alunos.', error });
    }
};

export const buscarAlunoPorId = async (req: Request, res: Response) => {
    try {
        const cpf = req.params.cpf;
        if (typeof cpf !== 'string') return res.status(400).json({ message: 'CPF invalido.' });
        const aluno = await AlunoService.buscarAlunoPorId(cpf);
        if (!aluno) return res.status(404).json({ message: 'Aluno nao encontrado.' });
        return res.status(200).json(aluno);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao buscar aluno.', error });
    }
};

export const listarTreinosModelo = async (req: Request, res: Response) => {
    try {
        const cpfPersonal = req.user?.cpf ?? '';
        const treinos = await TreinoService.listarTreinosModelo(cpfPersonal);
        return res.status(200).json(treinos);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao buscar treinos modelo.', error });
    }
};

export const associarTreino = async (req: Request, res: Response) => {
    try {
        const cpfPersonal = req.user?.cpf ?? '';
        const { idAluno, idTreino } = req.body;
        if (!idAluno || !idTreino)
            return res.status(400).json({ message: 'idAluno e idTreino sao obrigatorios.' });
        await TreinoService.associarTreino(idAluno, Number(idTreino), cpfPersonal, 'Treino');
        return res.status(201).json({ message: 'Treino associado com sucesso.' });
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao associar treino.', error });
    }
};
