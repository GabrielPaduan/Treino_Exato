import { Router } from 'express';                               // Importa o módulo Router do Express para criar rotas
import { login } from '../controllers/login_controller.js';     // Importa a função de login do controlador de login

// 1: Cria uma instância do Router para definir as rotas relacionadas ao login
const router = Router();

// 2: Define a rota POST para o endpoint '/login' e associa a função de login a essa rota
router.post('/login', login);

// 3: Exporta o router para ser usado em outros arquivos do projeto
export default router;