import express from 'express';                                              // Importa o Express para criar o roteador e usar os tipos de Request e Response
import { getDashboardAluno } from '../controllers/usuario_controller.js';   // Importa o Controller para acessar a função que lida com a lógica de negócio relacionada aos usuários (clientes)
import { verifyToken } from '../middleware/auth.middleware.js';             // Importa o middleware de autenticação para proteger as rotas, garantindo que apenas usuários autenticados possam acessar as informações dos treinos dos alunos.

// 1: Criamos um roteador do Express para definir as rotas relacionadas aos usuários (clientes)
const router = express.Router();

// Definimos a rota protegida pelo verifyToken
// Supondo que no seu arquivo principal (app.ts) esta rota seja chamada com '/treinos'
// O caminho final na web ficará: GET /treinos/aluno/:alunoId
router.get('/dashboard/:alunoId', verifyToken, getDashboardAluno);

// Exemplo de como ficariam futuras rotas aqui dentro:
// router.post('/', verifyToken, createTreino);
// router.put('/:id', verifyToken, updateTreino);
// router.delete('/:id', verifyToken, deleteTreino);

export default router;