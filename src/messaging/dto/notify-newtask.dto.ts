import { User } from '../../database/models/auth';
import { Task } from '../../database/models/tasks';

export class NotifyNewTaskDto {
  task: Task;
  user: User;
}
