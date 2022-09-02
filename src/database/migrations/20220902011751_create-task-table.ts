import { Knex } from 'knex';

const tableName = 'tasks';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(tableName, (t) => {
    t.uuid('id', { primaryKey: true });
    t.string('title');
    t.text('description');
    t.string('status');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(tableName);
}
