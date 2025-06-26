import { User } from './user';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  user?: User;
}