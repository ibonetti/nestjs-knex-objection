import {
  BadRequestException,
  ConflictException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { ModelClass } from 'objection';
import { User } from '../database/models/auth';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import {
  CountryCode,
  isValidPhoneNumber,
  parsePhoneNumber,
} from 'libphonenumber-js';

export class UserRepository {
  constructor(@Inject(User) private user: typeof User) {}

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password, phone_number, country } = authCredentialsDto;

    //const countrycode: CountryCode = <CountryCode>country;

    if (!isValidPhoneNumber(phone_number, country)) {
      throw new BadRequestException('Invalid phone number');
    }

    const phone = parsePhoneNumber(phone_number, country);

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      await this.user.query().insertGraph({
        id: uuid(),
        username,
        password: hashedPassword,
        phone_number: phone.number,
        country,
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
