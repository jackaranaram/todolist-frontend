// services/taskService.ts
import { BaseService } from '@/lib/baseService';
import { Task } from '@/models/task';
import { AxiosError } from 'axios';

class TaskService extends BaseService<Task> {
  constructor() {
    super('/tasks');
  }

  public async toogle(id: number | string): Promise<Task> {
      try {
        const res = await this.api.post<Task>(`${this.resourceEndpoint}/${id}/toggle`);
        return res.data;
      } catch (error) {
        throw this.handleError(error as AxiosError);
      }
    }
}

export const taskService = new TaskService();
