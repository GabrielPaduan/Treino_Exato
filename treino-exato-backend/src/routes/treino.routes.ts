import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware';
import {
    listarAlunos,
    buscarAlunoPorCpf,
    listarTreinosModelo,
    associarTreino
} from '../controllers/treino.controller';

const router = Router();

router.use(verifyToken);
// router.use(verifyToken, authorizeRoles('PERSONAL')); // reativar após login

router.get('/alunos', listarAlunos);
router.get('/alunos/:cpf', buscarAlunoPorCpf);
router.get('/treinos/modelos', listarTreinosModelo);
router.post('/treinos/associar', associarTreino);

export default router;
