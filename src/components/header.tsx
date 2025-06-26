'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Github, LogOut, User } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada exitosamente');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto border-b px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold"
            >
              ToDoList
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="https://github.com/jackaranaram/backend-todolist" target="_blank" rel="noreferrer">
              <Button variant="ghost" size="icon" className="cursor-pointer">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Button>
            </Link>
            
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2">
                  {user?.picture ? (
                    <Image 
                      src={user.picture} 
                      alt={user.name || user.username}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">
                    {user?.name || user?.username}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-sm cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Link href="/signin">
                  <Button variant="ghost" className="text-sm cursor-pointer">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/signin">
                  <Button className="text-sm hover:opacity-90 cursor-pointer">
                    Empezar
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
