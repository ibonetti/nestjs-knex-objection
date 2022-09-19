import { BullModule } from '@nestjs/bull';
import { Test } from '@nestjs/testing';
import { User } from '../database/models/auth';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  getTaksWithFilter: jest.fn(),
});

const mockUser = new User();

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository: TasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [BullModule.registerQueue({ name: 'sms' })],
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TaskRepository.getTaksWithFilter and returns the result', () => {
      expect(tasksRepository.getTaksWithFilter).not.toHaveBeenCalled();
      tasksService.getTaksWithFilter(null, mockUser);
      expect(tasksRepository.getTaksWithFilter).toHaveBeenCalled();
    });
  });
});
