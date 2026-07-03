import { Router } from 'express';   

import { getDashboard } from '../controllers/aluno_control.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/aluno/dashboard', verifyToken, getDashboard);

export default router