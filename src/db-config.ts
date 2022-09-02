import knex from 'knex';
import configuration from '../knexfile';

const knexConnection = knex(configuration);

export default knexConnection;
