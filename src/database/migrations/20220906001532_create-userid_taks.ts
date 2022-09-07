import { Knex } from 'knex';

const tableName = 'tasks';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(tableName, (t) => {
    t.uuid('userid').index().references('id').inTable('users');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(tableName, (t) => {
    t.dropColumn('userid');
  });
}
