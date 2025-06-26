// services/taskService.ts
import { BaseService } from '@/lib/baseService';
import { Task } from '@/models/task';
import { AxiosError } from 'axios';

class TaskService extends BaseService<Task> {
  constructor() {
    super('/tasks');
  }

  // Obtener las tareas del usuario autenticado
  public async getMyTasks(): Promise<Task[]> {
    try {
      const res = await this.api.get<Task[]>(this.resourceEndpoint);
      return res.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  // Crear una nueva tarea (solo envía el título)
  public async createTask(title: string): Promise<Task> {
    try {
      const res = await this.api.post<Task>(this.resourceEndpoint, { title });
      return res.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  // Toggle del estado de la tarea
  public async toggle(id: number | string): Promise<Task> {
    try {
      const res = await this.api.post<Task>(`${this.resourceEndpoint}/${id}/toggle`);
      return res.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  // Sobrescribir el método delete para usar el endpoint correcto
  public async deleteTask(id: number | string): Promise<void> {
    try {
      await this.api.delete(`${this.resourceEndpoint}/${id}`);
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }
}

export const taskService = new TaskService();
