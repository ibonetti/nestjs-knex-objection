import { Inject, NotFoundException } from '@nestjs/common';
import { Model, ModelClass } from 'objection';
import { Task, TaskStatus } from '../database/models/tasks';
import { CreateTaskDto } from './dto/create-task.dto';
import { v4 as uuid } from 'uuid';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

export class TasksRepository {
  constructor(@Inject('Task') private task: ModelClass<Task>) {}

  async getTaskById(id: string): Promise<Task> {
    const found = await this.task.query().findById(id);
    if (!found) {
      this.taskNotFoundError(id);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const inserted = await this.task.query().insertGraph({
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    });

    return inserted;
  }

  async getTaksWithFilter(filerDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filerDto;

    const query = this.task.query();
    if (status) {
      query.where('status', '=', status);
    }

    if (search) {
      const param = `%${search}%`;
      query.whereRaw('(title like :param or description like :param)', {
        param,
      });
    }

    return await query;
  }

  async deleteTask(id: string): Promise<void> {
    const ret = await this.task.query().deleteById(id);
    if (ret === 0) {
      this.taskNotFoundError(id);
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.task.query().patchAndFetchById(id, { status });
    if (!task) {
      this.taskNotFoundError(id);
    }
    return task;
  }

  private taskNotFoundError(id: string): NotFoundException {
    throw new NotFoundException(`Task with ID "${id}" not found!`);
  }
}
