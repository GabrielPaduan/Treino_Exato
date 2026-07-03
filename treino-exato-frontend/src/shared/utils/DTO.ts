export interface LoginDTO {
  login: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
}

export interface ExercicioDTO {
    id: string;
    nome_treino: string;
    series: number;
    repeticoes: string;
    videoUrl?: string;
}

export interface AlunoDTO {
    id: string;
    nome: string;
    foto?: string;
}