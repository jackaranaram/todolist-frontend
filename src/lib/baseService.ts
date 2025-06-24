// lib/baseService.ts
import { AxiosInstance, AxiosError } from 'axios';
import { toast } from 'sonner'; // o el sistema de alertas que uses
import { api } from './api';

export class BaseService<T> {
  protected api: AxiosInstance;
  protected resourceEndpoint: string;

  constructor(resourceEndpoint: string) {
    this.api = api;
    this.resourceEndpoint = resourceEndpoint;
  }

  protected handleError(error: AxiosError): never {
    let message = 'Ocurrió un error. Por favor, inténtelo de nuevo más tarde.';

    if (error.response) {
      const { status } = error.response;
      switch (status) {
        case 400:
          message = 'Datos inválidos. Por favor, revise los campos.';
          break;
        case 401:
        case 403:
          message = 'No tiene permiso para realizar esta acción.';
          break;
        case 404:
          message = 'Recurso no encontrado.';
          break;
        case 500:
        default:
          message = 'Error del servidor.';
          break;
      }
    } else if (error.request) {
      message = 'Error de red. Verifique su conexión.';
    }

    // Mostrar error en UI
    toast.error(message);
    throw new Error(message);
  }

  public async getAll(): Promise<T[]> {
    try {
      const res = await this.api.get<T[]>(this.resourceEndpoint);
      return res.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  public async create(data: Partial<T>): Promise<T> {
    try {
      const res = await this.api.post<T>(this.resourceEndpoint, data);
      return res.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  public async update(id: number | string, data: Partial<T>): Promise<T> {
    try {
      const res = await this.api.put<T>(`${this.resourceEndpoint}/${id}`, data);
      return res.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  public async delete(id: number | string): Promise<void> {
    try {
      await this.api.delete(`${this.resourceEndpoint}/${id}`);
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  public async healthCheck(): Promise<unknown> {
    try {
      const res = await this.api.get('/actuator/health');
      return res.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }
}
