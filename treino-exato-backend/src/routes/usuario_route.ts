import express from 'express';
import { getDashboardAluno } from '../controllers/usuario_controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

// 1: Criamos um roteador do Express para definir as rotas relacionadas aos usuários (clientes)
const router = express.Router();

// Definimos a rota protegida pelo verifyToken
// Supondo que no app.ts esta rota seja chamada com '/treinos'
// O caminho final na web ficará: GET /treinos/aluno/:alunoId
router.get('/dashboard/:alunoId', verifyToken, getDashboardAluno);

export default router;
