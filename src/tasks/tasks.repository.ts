import {
  Inject,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { Model, ModelClass } from 'objection';
import { Task, TaskStatus } from '../database/models/tasks';
import { CreateTaskDto } from './dto/create-task.dto';
import { v4 as uuid } from 'uuid';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../database/models/auth';
import { MessagingService } from '../messaging/messaging.service';

export class TasksRepository {
  private logger = new Logger('TasksRepository', { timestamp: true });

  constructor(
    @Inject(Task) private task: typeof Task,
    private messagingService: MessagingService,
  ) {}

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.task
      .query()
      .findById(id)
      .where('userid', '=', user.id);
    if (!found) {
      this.taskNotFoundError(id);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const inserted = await this.task.query().insertGraph({
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
      userid: user.id,
    });

    //Should send to some queue, but its just for testing...
    /*this.messagingService.sendNewtaskSmsToUser({
      task: inserted,
      user,
    });*/
    return inserted;
  }

  async getTaksWithFilter(
    filterDto: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.task.query();
    query.where('userid', '=', user.id);
    if (status) {
      query.where('status', '=', status);
    }

    if (search) {
      const param = `%${search}%`;
      query.whereRaw(
        '(LOWER(title) like LOWER(:param) or LOWER(description) like LOWER(:param))',
        {
          param,
        },
      );
    }

    try {
      return await query;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${
          user.username
        }". Filters: ${JSON.stringify(filterDto)}`,
        error,
      );
      throw new InternalServerErrorException(error);
    }
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const ret = await this.task
      .query()
      .deleteById(id)
      .where('userid', '=', user.id);
    if (ret === 0) {
      this.taskNotFoundError(id);
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.task
      .query()
      .patchAndFetchById(id, { status })
      .where('userid', '=', user.id);
    if (!task) {
      this.taskNotFoundError(id);
    }
    return task;
  }

  private taskNotFoundError(id: string): NotFoundException {
    throw new NotFoundException(`Task with ID "${id}" not found!`);
  }
}
