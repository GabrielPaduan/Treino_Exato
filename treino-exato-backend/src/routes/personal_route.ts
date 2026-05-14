import express from 'express';
import { getDashboardPersonal } from '../controllers/personal_controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

// 1: Criamos um roteador do Express para definir as rotas relacionadas aos personal trainers
const router = express.Router();

// No diagrama, a rota base é GET /api/personal/dashboard
// Supondo que no app.ts, app.use('/api/personal', personalRoutes)
// A rota aqui ficará assim:
router.get('/dashboard/:idPersonal', verifyToken, getDashboardPersonal);

export default router;