import {
  ConflictException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { ModelClass } from 'objection';
import { User } from 'src/database/models/auth';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';

export class UserRepository {
  constructor(@Inject('User') private user: ModelClass<User>) {}

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      await this.user.query().insertGraph({
        id: uuid(),
        username,
        password: hashedPassword,
      });
    } catch (error) {
      if (error.nativeError.code === '23505') {
        //duplicate username
        throw new ConflictException('Username already exists');
      }

      throw new InternalServerErrorException();
    }
  }

  async findByUserName(username: string): Promise<User> {
    return await this.user.query().findOne({ username });
  }
}
