import { Knex } from 'knex';

const configuration = {
  client: 'postgresql',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'task_management',
  },
  migrations: {
    directory: './src/database/migrations',
  },
  debug: false,
} as Knex.Config;

export default configuration;
