import express from 'express';
import * as personal_service from '../services/personal_service.js';

export const carregarAlunos = async (req: express.Request, res: express.Response) => {
    try {
        const personalId = req.params.idPersonal;
        if (!personalId || Array.isArray(personalId)) {
            return res.status(400).json({ error: "ID do personal inválido." });
        }
        const alunos = await personal_service.buscarAlunos(personalId);
        res.status(200).json(alunos);
    } 
    catch (error: any) {
        res.status(500).json({
            error: error.message
        });

    }
};

export const carregarPerfilAluno = async (req: express.Request, res: express.Response) => {
    const idAluno = req.params.idAluno;
    if (!idAluno || Array.isArray(idAluno)) {
        return res.status(400).json({ error: "ID do aluno inválido." });
    }
    try {
        const personalId = req.user!.cpf;
        const aluno = await personal_service.buscarPerfilAluno(personalId, idAluno);

        if (!aluno) {
            return res.status(404).json({ error: "Aluno não encontrado." });
        }
        res.status(200).json(aluno);
    } 
    catch (error: any) {
        res.status(500).json({ error: error.message });

    }
};