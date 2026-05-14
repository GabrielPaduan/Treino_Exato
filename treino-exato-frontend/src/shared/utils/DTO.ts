export interface LoginDTO {
  login: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
}

export interface Aluno {
  id: number;
  name: string;
  avatarUrl: string;
}

export interface DashboardPersonalResponse {
  alunos: Aluno[];
}