export interface LoginDTO {
  login: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
}

export interface User {
  cpf: string,
  nome: string,
  email: string,
  password_hash: string
}

export interface Exercicio {
  id: string;
  nome: string;
  series: number;
  repeticoes: string;
}

export interface Agenda {
  id: string;
  aluno_id: string;
  data: string;
}

export interface TokenPayload {
    sub: string;
    email: string;
    name: string;
    role: string;
    id?: string;
}

export interface AuthRequest extends Request {
    user: TokenPayload;
}