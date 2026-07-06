import { Router } from 'express';   

import { getDashboard } from '../controllers/aluno_control.js';
import { authorizeRoles, verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/dashboard', verifyToken, authorizeRoles('ALUNO'), getDashboard);

export default router