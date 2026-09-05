export interface RegisterDTO {
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  user: {
    id: string;
    email: string;
    role: string;
  };
  token: string;
}