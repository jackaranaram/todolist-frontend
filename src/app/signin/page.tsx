'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GoogleSignIn } from "@/components/GoogleSignIn";
import { AuthGuard } from "@/components/AuthGuard";
import { authService } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await authService.login({ 
        username: email, 
        password 
      });
      console.log('Login result:', result);

      if (result.access_token) {
        login(result.access_token, result.user);
        toast.success('¡Bienvenido! Has iniciado sesión exitosamente.');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      toast.error('Credenciales inválidas. Verifica tu email y contraseña.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = () => {
    router.push('/dashboard');
  };

  return (
    <AuthGuard requireAuth={false}>
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
            <CardDescription className="text-center">
              Ingresa tus credenciales para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email o Nombre de Usuario</Label>
                <Input 
                  id="email" 
                  type="text" 
                  placeholder="Ingresa tu email o nombre de usuario" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Ingresa tu contraseña" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required 
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  O continúa con
                </span>
              </div>
            </div>

            <GoogleSignIn 
              onSuccess={handleGoogleSuccess}
              onError={(error) => {
                console.error('Error con Google Sign-In:', error);
                toast.error('Error al iniciar sesión con Google');
              }}
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>¿No tienes una cuenta? 
                <Link href="/signup" className="text-primary hover:underline font-medium ml-1">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </AuthGuard>
  );
}
