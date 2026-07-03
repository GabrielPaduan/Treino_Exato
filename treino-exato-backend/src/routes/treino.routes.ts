import { Router } from 'express';
import { verifyToken, authorizeRoles } from '../middleware/auth.middleware.js';
import {
    listarAlunos, buscarAlunoPorId, listarTreinosModelo, associarTreino
} from '../controllers/treino.controller.js';

const router = Router();
router.use(verifyToken, authorizeRoles('PERSONAL'));
router.get('/alunos', listarAlunos);
router.get('/alunos/:cpf', buscarAlunoPorId);
router.get('/treinos/modelos', listarTreinosModelo);
router.post('/treinos/associar', associarTreino);
export default router;
