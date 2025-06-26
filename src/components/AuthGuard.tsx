'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

/**
 * AuthGuard component to handle authentication redirects
 * @param children - The content to render
 * @param redirectTo - Where to redirect (default: '/dashboard' for authenticated users, '/signin' for unauthenticated)
 * @param requireAuth - If true, redirects unauthenticated users to signin. If false, redirects authenticated users to dashboard
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  redirectTo,
  requireAuth = false 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Wait for auth state to load

    if (requireAuth && !isAuthenticated) {
      // User needs to be authenticated but isn't - redirect to signin
      router.push(redirectTo || '/signin');
    } else if (!requireAuth && isAuthenticated) {
      // User is authenticated but shouldn't be on this page - redirect to dashboard
      router.push(redirectTo || '/dashboard');
    }
  }, [isAuthenticated, isLoading, router, redirectTo, requireAuth]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render children if redirect is needed
  if (requireAuth && !isAuthenticated) {
    return null;
  }
  
  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
