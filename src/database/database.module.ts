import { Global, Module, Provider } from '@nestjs/common';
import knex from 'knex';
import configuration from '../../knexfile';
import { Model } from 'objection';
import { Task } from './models/tasks';
import { User } from './models/auth';

const models = [Task, User];

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
