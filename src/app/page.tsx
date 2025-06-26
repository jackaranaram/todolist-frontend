'use client';

import { useState } from 'react';
import DynamicIslandTodo from '@/components/shared/dynamic-island-todo';
import { Task } from '@/models/task';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

// Datos de ejemplo para la demo
const initialDemoTasks: Task[] = [
  { id: 1, title: 'Diseñar la interfaz de usuario', completed: false },
  { id: 2, title: 'Implementar autenticación', completed: true },
  { id: 3, title: 'Configurar base de datos', completed: false },
  { id: 4, title: 'Escribir documentación', completed: false },
];

export default function Home() {
  const [demoTasks, setDemoTasks] = useState<Task[]>(initialDemoTasks);
  const { isAuthenticated } = useAuth();

  const handleAdd = (title: string) => {
    const newTask: Task = {
      id: Date.now(), // Simple ID generation for demo
      title,
      completed: false,
    };
    setDemoTasks((prev) => [...prev, newTask]);
  };

  const handleToggle = (id: number) => {
    setDemoTasks((prev) => 
      prev.map((task) => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDelete = (id: number) => {
    setDemoTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div className="relative min-h-screen">
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/10 blur-[100px]" />
      </div>

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
            To-Do List - Arack
          </h1>
          <p className="text-gray-400 text-sm md:text-base mb-4">
            Organiza tus tareas diarias con estilo. ¡Simple, rápido y eficiente!
          </p>
          
          {/* Demo Notice */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-yellow-300 text-sm font-medium mb-2">
              🎨 Modo Demo - Vista Previa
            </p>
            <p className="text-gray-400 text-xs">
              {isAuthenticated 
                ? "Estás logueado. Ve a tu dashboard para gestionar tus tareas reales."
                : "Estás viendo una versión de demostración. Los datos solo se guardan temporalmente en esta sesión."
              }
            </p>
          </div>
        </div>

        <DynamicIslandTodo
          tasks={demoTasks}
          onAdd={handleAdd}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
        
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs">
            💡 {isAuthenticated ? (
              <Link href="/dashboard" className="text-primary hover:underline">Ve a tu dashboard</Link>
            ) : (
              <Link href="/signin" className="text-primary hover:underline">Inicia sesión</Link>
            )} para {isAuthenticated ? "gestionar tus tareas reales" : "guardar tus tareas permanentemente"}
          </p>
        </div>
      </main>
    </div>
  );
}
