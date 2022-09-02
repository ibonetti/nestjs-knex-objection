import { IsEnum } from 'class-validator';
import { TaskStatus } from '../../database/models/tasks/task-status.enum';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
