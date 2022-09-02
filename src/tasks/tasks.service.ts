import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task, TaskStatus } from 'src/database/models/tasks';
import { ModelClass } from 'objection';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TasksRepository) {}

  getTaskById(id: string): Promise<Task> {
    return this.taskRepository.getTaskById(id);
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  getTaksWithFilter(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTaksWithFilter(filterDto);
  }

  async deleteTask(id: string): Promise<void> {
    return await this.taskRepository.deleteTask(id);
  }

  updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    return this.taskRepository.updateTaskStatus(id, status);
  }
}
