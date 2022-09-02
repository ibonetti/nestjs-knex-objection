import { Injectable } from '@nestjs/common';
import { query } from 'express';
import { Model } from 'objection';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TaskModel extends Model {
  static tableName = 'tasks';

  id!: string;
  title!: string;
  description!: string;
  status!: TaskStatus;
}
