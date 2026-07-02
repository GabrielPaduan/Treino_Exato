import type { ExercicioDTO } from '../utils/DTO';
import api from './api';

export async function getDashboardData(token: string): Promise<ExercicioDTO[]> {
    const response = await api.get<ExercicioDTO[]>('/api/aluno/dashboard', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    // Retorna Exercicios[] (pode ser lista vazia conforme o diagrama)
    return response.data;
}