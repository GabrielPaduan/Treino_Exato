import { Router } from 'express';
import { verifyToken, authorizeRoles } from '../middleware/auth.middleware.js';
import {
    listarAlunos, buscarAlunoPorId, listarTreinosModelo, associarTreino
} from '../controllers/treino_controller.js';

const router = Router();
router.use(verifyToken, authorizeRoles('PERSONAL'));
router.get('/alunos', listarAlunos);
router.get('/alunos/:cpf', buscarAlunoPorId);
router.get('/modelos', listarTreinosModelo);
router.post('/associar', associarTreino);
export default router;
