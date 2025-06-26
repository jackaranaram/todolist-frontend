'use client';

import { useEffect, useState } from 'react';
import { taskService } from '@/services/taskService';
import DynamicIslandTodo from '@/components/shared/dynamic-island-todo';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Task } from '@/models/task';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const data = await taskService.getMyTasks();
        setTasks(data);
      } catch (error) {
        console.error('Error al cargar las tareas:', error);
        toast.error('Error al cargar las tareas');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, [user]);

  const handleAdd = async (title: string) => {
    try {
      const newTask = await taskService.createTask(title);
      setTasks((prev) => [...prev, newTask]);
      toast.success('Tarea creada exitosamente');
    } catch (error) {
      console.error('Error al crear la tarea:', error);
      toast.error('Error al crear la tarea');
    }
  };

  const handleToggle = async (id: number) => {
    try {
      const updated = await taskService.toggle(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      toast.success(`Tarea ${updated.completed ? 'completada' : 'marcada como pendiente'}`);
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
      toast.error('Error al actualizar la tarea');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success('Tarea eliminada');
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
      toast.error('Error al eliminar la tarea');
    }
  };

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen">
        
        {/* Background gradients */}
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
          <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-blue-500/10 blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/10 blur-[100px]" />
        </div>

        <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
              Mi Dashboard
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              Organiza tus tareas diarias con estilo. ¡Simple, rápido y eficiente!
            </p>
            {user && (
              <p className="text-gray-500 text-xs mt-2">
                Bienvenido, {user.name || user.username}
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span>Cargando tareas...</span>
            </div>
          ) : (
            <DynamicIslandTodo
              tasks={tasks}
              onAdd={handleAdd}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
