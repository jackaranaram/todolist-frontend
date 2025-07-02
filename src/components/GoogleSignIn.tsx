'use client';

import { useCallback, useEffect, useRef } from 'react';
import { authService } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface GoogleSignInProps {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  showPopupButton?: boolean; // Nueva prop para mostrar botón de popup
  autoPrompt?: boolean; // Nueva prop para mostrar popup automáticamente al cargar
}

interface GoogleResponse {
  credential: string;
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: { 
            client_id: string; 
            callback: (response: GoogleResponse) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            use_fedcm_for_prompt?: boolean;
          }) => void;
          renderButton: (element: HTMLElement, options: { 
            theme: string; 
            size: string; 
            width: string; 
            text: string; 
            shape: string; 
            logo_alignment: string; 
          }) => void;
          prompt: (callback?: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean; isDismissedMoment: () => boolean; getNotDisplayedReason: () => string; getSkippedReason: () => string; getDismissedReason: () => string; }) => void) => void;
          disableAutoSelect: () => void;
        };
      };
      oauth2: {
        initTokenClient: (config: {
          client_id: string;
          scope: string;
          callback: (response: { access_token: string; }) => void;
        }) => {
          requestAccessToken: () => void;
        };
      };
    };
  }
}

export const GoogleSignIn: React.FC<GoogleSignInProps> = ({ onSuccess, onError, showPopupButton = false, autoPrompt = false }) => {
  const { login } = useAuth();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const handleGooglePopup = useCallback(async () => {
    try {
      if (window.google?.accounts?.id) {
        // Mostrar el popup de One Tap
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed()) {
            console.log('Google Sign-In popup no se mostró:', notification.getNotDisplayedReason());
          } else if (notification.isSkippedMoment()) {
            console.log('Google Sign-In popup fue omitido:', notification.getSkippedReason());
          } else if (notification.isDismissedMoment()) {
            console.log('Google Sign-In popup fue cerrado:', notification.getDismissedReason());
          }
        });
      }
    } catch (error) {
      console.error('Error al mostrar Google Sign-In popup:', error);
      toast.error('Error al abrir el popup de Google Sign-In');
      onError?.(error);
    }
  }, [onError]);

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
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '453243235340-gevjpamqv5iilbn34idb243dvdjjvr6v.apps.googleusercontent.com';
        
        console.log('Inicializando Google Sign-In con Client ID:', clientId);
        console.log('Origin actual:', window.location.origin);
        
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleSignIn,
            auto_select: false,
            cancel_on_tap_outside: false,
            use_fedcm_for_prompt: false, // Deshabilitar FedCM para evitar errores
          });

          // Solo renderizar el botón si showPopupButton está habilitado o si no es autoPrompt
          if (showPopupButton || !autoPrompt) {
            window.google.accounts.id.renderButton(googleButtonRef.current, {
              theme: 'outline',
              size: 'large',
              width: '100',
              text: 'signin_with',
              shape: 'rectangular',
              logo_alignment: 'left',
            });
          }

          // Mostrar popup automáticamente si autoPrompt está habilitado
          if (autoPrompt) {
            // Agregar un pequeño delay para asegurar que la inicialización esté completa
            setTimeout(() => {
              try {
                window.google.accounts.id.prompt((notification) => {
                  if (notification.isNotDisplayed()) {
                    const reason = notification.getNotDisplayedReason();
                    console.log('Google Sign-In popup no se mostró:', reason);
                    
                    if (reason === 'unknown_reason' || reason === 'opt_out_or_no_session') {
                      console.warn('Google Sign-In no disponible. Posibles causas: FedCM deshabilitado, sin sesión de Google, o configuración incorrecta.');
                      // Mostrar un mensaje informativo al usuario
                      if (onError) {
                        onError(new Error('Google Sign-In no está disponible en este momento.'));
                      }
                    }
                  } else if (notification.isSkippedMoment()) {
                    console.log('Google Sign-In popup fue omitido:', notification.getSkippedReason());
                  } else if (notification.isDismissedMoment()) {
                    console.log('Google Sign-In popup fue cerrado:', notification.getDismissedReason());
                  }
                });
              } catch (promptError) {
                console.error('Error al mostrar popup automático:', promptError);
                console.warn('💡 Para resolver este error:');
                console.warn('1. Ve a https://console.cloud.google.com/apis/credentials');
                console.warn('2. Edita el Client ID:', clientId);
                console.warn('3. Agrega http://localhost:3000 a "Authorized JavaScript origins"');
              }
            }, 1000);
          }
        } catch (error) {
          console.error('Error al inicializar Google Sign-In:', error);
          console.warn('💡 Verifica la configuración del Client ID en Google Cloud Console');
          toast.error('Error al cargar Google Sign-In. Verifique la configuración.');
        }
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
  }, [handleGoogleSignIn, autoPrompt, showPopupButton, onError]);

  return (
    <div className="w-full space-y-3">
      {/* Botón renderizado por Google */}
      <div ref={googleButtonRef} className="w-full flex justify-center"></div>
      
      {/* Botón adicional para popup (si está habilitado) */}
      {showPopupButton && (
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={handleGooglePopup}
            className="w-full max-w-sm flex items-center justify-center space-x-2 border-gray-300 hover:border-gray-400"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continuar con Google (Popup)</span>
          </Button>
        </div>
      )}
    </div>
  );
};
