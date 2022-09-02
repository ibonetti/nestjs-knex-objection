import { Global, Module, Provider } from '@nestjs/common';
import knex from 'knex';
import configuration from '../../knexfile';
import { Model } from 'objection';
import { TasksRepository } from '../tasks/tasks.repository';
import { TaskModel } from './models/tasks';

const models = [TaskModel];

const modelsProviders = models.map((model) => {
  return {
    provide: model.name,
    useValue: model,
  };
});

const providers: Provider[] = [
  ...modelsProviders,
  {
    provide: 'KnexConnection',
    useFactory: async () => {
      const knexConn = knex(configuration);

      Model.knex(knexConn);
      return knex;
    },
  },
];

@Global()
@Module({
  providers: [...providers],
  exports: [...providers],
})
export class DatabaseModule {}
