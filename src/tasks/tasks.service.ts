import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskModel } from 'src/database/models/task.entity';
import { ModelClass } from 'objection';

@Injectable()
export class TasksService {
  constructor(@Inject('TaskModel') private taskModel: ModelClass<TaskModel>) {}

  async getTaskById(id: string): Promise<TaskModel | null> {
    const found = await this.taskModel.query().findById(id);
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found!`);
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
      query.whereRaw('(title like ?)', [`%${search}%`]);
    }

    return await query;
  }

  /*getAllTasks(): Task[] {
    return this.tasks;
  }

  async getTaskDB() {
    const query = await this.taskModel.query();
    return query;
  }

  getTaskById(id: string): Task | null {
    const found = this.tasks.find((t) => t.id === id);
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found!`);
    }
    return found;
  }

  getTaksWithFilter(filerDto: GetTasksFilterDto): Task[] {
    const { status, search } = filerDto;

    let tasks = this.getAllTasks();
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return tasks;
  }

  deleteTask(id: string): void {
    const found = this.getTaskById(id);
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  async createTaskDB(createTaskDto: CreateTaskDto): Promise<TaskModel> {
    const { title, description } = createTaskDto;
    const inserted = await this.taskModel.query().insertGraph({
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    });

    return inserted;
  }*/
}
