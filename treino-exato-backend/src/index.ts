import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';

import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:3000'
    ],
    credentials: true
}));

app.use(express.json());

app.use('/auth', authRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});