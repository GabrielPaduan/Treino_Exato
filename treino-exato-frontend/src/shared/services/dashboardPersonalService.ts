import type { DashboardPersonalResponse } from '../utils/DTO';
import api from './api';

export const buscarAlunos = async (): Promise<DashboardPersonalResponse> => {
    const response = await api.get<DashboardPersonalResponse>('/personal/dashboard');
    return response.data;
};