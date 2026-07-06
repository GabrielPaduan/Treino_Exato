import { TreinoRepository } from '../repositories/treino_repository.js';
 
export const TreinoService = {
    listarTreinosModelo: (cpfPersonal: string) => TreinoRepository.buscarTreinosModelo(cpfPersonal),
    associarTreino: (idAluno: string, idTreino: number, cpfPersonal: string, nomeAgenda: string) =>
        TreinoRepository.cadastrarNovoTreino(idAluno, idTreino, cpfPersonal, nomeAgenda),
};
