import { query } from 'express';
import { Model } from 'objection';
import { TaskStatus } from './task-status.enum';

export class TaskModel extends Model {
  static tableName = 'tasks';

  id!: string;
  title!: string;
  description!: string;
  status!: TaskStatus;
}
