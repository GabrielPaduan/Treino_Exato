import type { Request, Response } from 'express';
import supabase from '../config/supabase';

// GET /api/alunos
// Lista alunos vinculados ao personal autenticado (via vinculo_personal_aluno)
export const listarAlunos = async (req: Request, res: Response) => {
    const cpfPersonal = req.user?.sub;
    
    const { data: vinculos, error: erroVinculo } = await supabase
        .from('vinculo_personal_aluno')
        .select('cpf_aluno')
        .eq('cpf_personal', cpfPersonal)
        .eq('status', 1);

    if (erroVinculo) {
        return res.status(500).json({ message: 'Erro ao buscar vínculos.', error: erroVinculo });
    }

    if (!vinculos || vinculos.length === 0) {
        return res.status(200).json([]);
    }

    const cpfsAlunos = vinculos.map((v) => v.cpf_aluno);

    const { data: alunos, error: erroAluno } = await supabase
        .from('aluno')
        .select('cpf_usuario, descricao_lesao, usuario(cpf, nome, email)')
        .in('cpf_usuario', cpfsAlunos);

    if (erroAluno) {
        return res.status(500).json({ message: 'Erro ao buscar dados dos alunos.', error: erroAluno });
    }

    return res.status(200).json(alunos);
};

// GET /api/alunos/:cpf
// Perfil detalhado de um aluno
export const buscarAlunoPorCpf = async (req: Request, res: Response) => {
    const { cpf } = req.params;

    const { data, error } = await supabase
        .from('aluno')
        .select('cpf_usuario, descricao_lesao, usuario(cpf, nome, email)')
        .eq('cpf_usuario', cpf)
        .single();

    if (error || !data) {
        return res.status(404).json({ message: 'Aluno não encontrado.' });
    }

    return res.status(200).json(data);
};

// GET /api/treinos/modelos
// Lista treinos criados pelo personal autenticado
export const listarTreinosModelo = async (req: Request, res: Response) => {
    const cpfPersonal = req.user?.sub;

    const { data, error } = await supabase
        .from('treino')
        .select('id, nome_treino, descricao_treino')
        .eq('cpf_personal', cpfPersonal);

    if (error) {
        return res.status(500).json({ message: 'Erro ao buscar treinos modelo.', error });
    }

    return res.status(200).json(data);
};

// POST /api/treinos/associar
// Associa um treino a um aluno via tabela agenda
export const associarTreino = async (req: Request, res: Response) => {
    const cpfPersonal = req.user?.sub;
    const { cpfAluno, idTreino, nomeAgenda, diaSemana } = req.body;

    if (!cpfAluno || !idTreino) {
        return res.status(400).json({ message: 'cpfAluno e idTreino são obrigatórios.' });
    }

    const { error } = await supabase
        .from('agenda')
        .insert({
            nome_agenda: nomeAgenda || 'Treino',
            dia_semana: diaSemana || null,
            cpf_personal: cpfPersonal,
            cpf_aluno: cpfAluno,
            id_treino: idTreino,
        });

    if (error) {
        return res.status(500).json({ message: 'Erro ao associar treino ao aluno.', error });
    }

    return res.status(201).json({ message: 'Treino associado com sucesso.' });
};
