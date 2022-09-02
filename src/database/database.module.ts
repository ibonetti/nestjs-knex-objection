import { Global, Module, Provider } from '@nestjs/common';
import knex from 'knex';
import configuration from '../../knexfile';
import { Model } from 'objection';
import { TaskModel } from './models/task.entity';

const models = [TaskModel];

const modelProviders = models.map((model) => {
  return {
    provide: model.name,
    useValue: model,
  };
});

const providers: Provider[] = [
  ...modelProviders,
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
