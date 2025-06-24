'use client';

import { useEffect, useState } from 'react';
import { taskService } from '@/services/taskService';
import DynamicIslandTodo from '@/components/shared/dynamic-island-todo';
import { Task } from '@/models/task';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await taskService.getAll();
        setTasks(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTasks();
  }, []);

  const handleAdd = async (title: string) => {
    try {
      const newTask = await taskService.create({ title, completed: false });
      setTasks((prev) => [...prev, newTask]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      const updated = await taskService.toogle(task.id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await taskService.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/10 blur-[100px]" />
      </div>

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
            To-Do List - Arack
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Organiza tus tareas diarias con estilo. ¡Simple, rápido y eficiente!
          </p>
        </div>
        <DynamicIslandTodo
          tasks={tasks}
          onAdd={handleAdd}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}
