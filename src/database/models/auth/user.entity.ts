import { Model } from 'objection';

export class User extends Model {
  static tableName = 'users';

  id!: string;
  username!: string;
  password: string;
}
