import type { AlunoDTO } from "../types/DTO.js";
import * as personal_repository from "../repositories/personal_repository.js";

export const buscarAlunos = async (
    personalId: string
): Promise<AlunoDTO[]> => {
    const alunos = await personal_repository.obterAlunosVinculados(personalId);

    return alunos
        .filter((aluno): aluno is NonNullable<typeof aluno> => aluno !== null)
        .map(aluno => ({
            cpf: aluno.cpf,
            nome: aluno.nome
        }));
};

export const buscarPerfilAluno = async (
    personalId: string,
    idAluno: string
): Promise<AlunoDTO | null> => {

    const aluno = await personal_repository.obterPerfilAluno(
        personalId,
        idAluno
    );

    if (!aluno) {
        return null;
    }

    return {
        cpf: aluno.cpf,
        nome: aluno.nome
    };
};