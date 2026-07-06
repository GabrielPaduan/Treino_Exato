import { AlunoRepository } from '../repositories/aluno_repository.js';

export const AlunoService = {
    listarAlunos: (cpfPersonal: string) => AlunoRepository.buscarTodos(cpfPersonal),
    buscarAlunoPorId: (cpf: string) => AlunoRepository.buscarPorId(cpf),
};
