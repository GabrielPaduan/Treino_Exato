import { Router } from "express";
import * as personal_controller from '../controllers/personal_controller.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/dashboard/:idPersonal', verifyToken, authorizeRoles('PERSONAL'), personal_controller.carregarAlunos);

router.get('/dashboard/buscarAlunos/:idAluno', verifyToken, authorizeRoles('PERSONAL'), personal_controller.carregarPerfilAluno);

export default router;