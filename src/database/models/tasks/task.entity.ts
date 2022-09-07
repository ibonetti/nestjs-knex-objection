import { Model, RelationMappings, RelationMappingsThunk } from 'objection';
import { User } from '../auth';
import { TaskStatus } from './task-status.enum';

export class Task extends Model {
  static tableName = 'tasks';

  id!: string;
  title!: string;
  description!: string;
  status!: TaskStatus;
  userid!: string;

  static get relationMappings(): RelationMappings | RelationMappingsThunk {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'tasks.userid',
          to: 'users.id',
        },
      },
    };
  }
}
