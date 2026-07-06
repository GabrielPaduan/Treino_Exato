import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import treinoRoutes from './routes/treino_routes.js';
import authRoutes from './routes/login_routes.js';
import appRoutes from './routes/routes.js';
import personalRoutes from './routes/personal_routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:3000'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

app.use('/treino', treinoRoutes);
app.use('/auth', authRoutes);
app.use('/aluno', appRoutes);
app.use('/personal', personalRoutes);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
