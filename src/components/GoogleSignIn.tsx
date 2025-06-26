'use client';

import { useCallback, useEffect, useRef } from 'react';
import { authService } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface GoogleSignInProps {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

interface GoogleResponse {
  credential: string;
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: GoogleResponse) => void }) => void;
          renderButton: (element: HTMLElement, options: { 
            theme: string; 
            size: string; 
            width: string; 
            text: string; 
            shape: string; 
            logo_alignment: string; 
          }) => void;
        };
      };
    };
  }
}

export const GoogleSignIn: React.FC<GoogleSignInProps> = ({ onSuccess, onError }) => {
  const { login } = useAuth();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const handleGoogleSignIn = useCallback(async (response: GoogleResponse) => {
    try {
      const result = await authService.googleLogin({ idToken: response.credential });
      
      if (result.access_token) {
        login(result.access_token, result.user);
        toast.success('¡Bienvenido! Has iniciado sesión exitosamente.');
        onSuccess?.();
      }
    } catch (error) {
      console.error('Error en el login con Google:', error);
      toast.error('Error al iniciar sesión con Google. Inténtalo de nuevo.');
      onError?.(error);
    }
  }, [login, onSuccess, onError]);

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '421025303274-i6ge4o1na2jlmls4bqtns8hgg1toncmk.apps.googleusercontent.com',
          callback: handleGoogleSignIn,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
        });
      }
    };

    // Si Google ya está cargado, inicializar inmediatamente
    if (window.google) {
      initializeGoogleSignIn();
    } else {
      // Si no, esperar a que se cargue
      const checkGoogle = setInterval(() => {
        if (window.google) {
          initializeGoogleSignIn();
          clearInterval(checkGoogle);
        }
      }, 100);

      return () => clearInterval(checkGoogle);
    }
  }, [handleGoogleSignIn]);

  return (
    <div className="w-full">
      <div ref={googleButtonRef} className="w-full flex justify-center"></div>
    </div>
  );
};
