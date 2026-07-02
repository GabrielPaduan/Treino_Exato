import { Router } from 'express';   

import { getDashboard } from '../controllers/aluno_control.js';
import { verifyTokenFake, verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/aluno/dashboard', verifyTokenFake, getDashboard);

export default router