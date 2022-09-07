import { Model, RelationMappings, RelationMappingsThunk } from 'objection';
import { Task } from '../tasks';

export class User extends Model {
  static tableName = 'users';

  id!: string;
  username!: string;
  password: string;

  static get relationMappings(): RelationMappings | RelationMappingsThunk {
    return {
      taks: {
        relation: Model.HasManyRelation,
        modelClass: Task,
        join: {
          from: 'users.id',
          to: 'tasks.userid',
        },
      },
    };
  }
}
