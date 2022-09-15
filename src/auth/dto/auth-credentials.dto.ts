import { string } from '@hapi/joi';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CountryCode } from 'libphonenumber-js';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak!!!',
  })
  password: string;

  @IsNotEmpty()
  phone_number: string;

  @Type(() => string)
  @MaxLength(2, { message: 'Please inform the country initials!' })
  @Transform((value) => <CountryCode>value.value)
  country: CountryCode;
}
