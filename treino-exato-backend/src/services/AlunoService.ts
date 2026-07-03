import { AlunoRepository } from '../repositories/AlunoRepository.js';

export const AlunoService = {
    listarAlunos: (cpfPersonal: string) => AlunoRepository.buscarTodos(cpfPersonal),
    buscarAlunoPorId: (cpf: string) => AlunoRepository.buscarPorId(cpf),
};
