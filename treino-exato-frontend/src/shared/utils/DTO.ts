export interface LoginDTO {
  login: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
}

export interface ExercicioDTO {
    id: string;
    nome: string;
    series: number;
    repeticoes: string;
    videoUrl?: string;
}