import { Model } from 'objection';
import { TaskStatus } from './task.model';

export class Task extends Model {
  static tableName = 'tasks';

  id!: string;
  title!: string;
  description!: string;
  status!: TaskStatus;
}
