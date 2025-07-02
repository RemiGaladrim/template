// DTOs d'authentification partagés entre backend et frontends

export interface SignInDto {
  email: string;
  password: string;
}

export interface SignUpDto {
  email: string;
  password: string;
  name: string;
}

export interface JwtPayloadDto {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

// Types pour les réponses d'authentification
export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  user: UserDto;
}

export interface UserDto {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
