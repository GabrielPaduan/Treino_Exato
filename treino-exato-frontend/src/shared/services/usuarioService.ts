import type { LoginDTO, LoginResponse } from "../utils/DTO";
import api from './api';

export const loginUser = async (loginData: LoginDTO): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', loginData);
    return response.data;
};