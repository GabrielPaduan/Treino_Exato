import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';

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

// Exemplos de uso de rotas
// app.use('/usuario', rotasUsuario);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});