import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskModel, TaskStatus } from 'src/database/models/tasks';
import { ModelClass } from 'objection';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TasksRepository) {}

  getTaskById(id: string): Promise<TaskModel> {
    return this.taskRepository.getTaskById(id);
  }

  createTask(createTaskDto: CreateTaskDto): Promise<TaskModel> {
    return this.taskRepository.createTask(createTaskDto);
  }

  getTaksWithFilter(filterDto: GetTasksFilterDto): Promise<TaskModel[]> {
    return this.taskRepository.getTaksWithFilter(filterDto);
  }

  async deleteTask(id: string): Promise<void> {
    return await this.taskRepository.deleteTask(id);
  }

  updateTaskStatus(id: string, status: TaskStatus): Promise<TaskModel> {
    return this.taskRepository.updateTaskStatus(id, status);
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
