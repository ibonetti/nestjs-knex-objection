import { Inject, NotFoundException } from '@nestjs/common';
import { ModelClass } from 'objection';
import { TaskModel, TaskStatus } from '../database/models/tasks';
import { CreateTaskDto } from './dto/create-task.dto';
import { v4 as uuid } from 'uuid';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

export class TasksRepository {
  constructor(@Inject('TaskModel') private taskModel: ModelClass<TaskModel>) {}

  async getTaskById(id: string): Promise<TaskModel> {
    const found = await this.taskModel.query().findById(id);
    if (!found) {
      this.taskNotFoundError(id);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskModel> {
    const { title, description } = createTaskDto;
    const inserted = await this.taskModel.query().insertGraph({
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    });

    return inserted;
  }

  async getTaksWithFilter(filerDto: GetTasksFilterDto): Promise<TaskModel[]> {
    const { status, search } = filerDto;

    const query = this.taskModel.query();
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
    const ret = await this.taskModel.query().deleteById(id);
    if (ret === 0) {
      this.taskNotFoundError(id);
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<TaskModel> {
    const task = await this.taskModel.query().patchAndFetchById(id, { status });
    if (!task) {
      this.taskNotFoundError(id);
    }
    return task;
  }

  private taskNotFoundError(id: string): NotFoundException {
    throw new NotFoundException(`Task with ID "${id}" not found!`);
  }
}
