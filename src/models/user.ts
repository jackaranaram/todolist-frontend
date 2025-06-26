export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  picture: string;
  googleId?: string;
  emailVerified?: boolean;
}

export interface GoogleLoginDto {
  idToken: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}
