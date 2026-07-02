export interface LoginDTO {
  login: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
}

export interface AlunoDTO {
    id: string;
    nome: string;
    foto?: string;
}