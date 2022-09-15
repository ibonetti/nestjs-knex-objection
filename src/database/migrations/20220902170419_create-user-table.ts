import { Knex } from 'knex';

const tableName = 'users';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(tableName, (t) => {
    t.uuid('id', { primaryKey: true });
    t.string('username').unique();
    t.string('password');
    t.string('phone_number');
    t.string('country', 2);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(tableName);
}
