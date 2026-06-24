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