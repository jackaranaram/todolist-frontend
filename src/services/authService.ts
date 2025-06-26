import { api } from '@/lib/api';
import { User, LoginRequest, LoginResponse, GoogleLoginDto, RegisterRequest } from '@/models/user';

class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  // Login con username/password
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    
    if (response.data.access_token) {
      this.setToken(response.data.access_token);
      console.log('Login successful:', response.data.user);
      if (response.data.user) {
        this.setUser(response.data.user);
      }
    }
    
    return response.data;
  }

  // Login con Google
  async googleLogin(googleLoginDto: GoogleLoginDto): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/google', googleLoginDto);
    
    if (response.data.access_token) {
      this.setToken(response.data.access_token);
      if (response.data.user) {
        this.setUser(response.data.user);
      }
    }
    
    return response.data;
  }

  // Registro de usuario
  async register(credentials: RegisterRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/register', credentials);
    
    if (response.data.access_token) {
      this.setToken(response.data.access_token);
      if (response.data.user) {
        this.setUser(response.data.user);
      }
    }
    
    return response.data;
  }

  // Logout
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    // Redirect to login page
    window.location.href = '/signin';
  }

  // Obtener token
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Guardar token
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Obtener usuario
  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Guardar usuario
  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Obtener header de autorización
  getAuthHeader(): { Authorization: string } | Record<string, never> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export const authService = new AuthService();
