import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task, TaskStatus } from 'src/database/models/tasks';
import { ModelClass } from 'objection';
import { TasksRepository } from './tasks.repository';
import { User } from 'src/database/models/auth';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TasksRepository) {}

  getTaskById(id: string, user: User): Promise<Task> {
    return this.taskRepository.getTaskById(id, user);
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  getTaksWithFilter(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTaksWithFilter(filterDto, user);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    return await this.taskRepository.deleteTask(id, user);
  }

  updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
    return this.taskRepository.updateTaskStatus(id, status, user);
  }
}
