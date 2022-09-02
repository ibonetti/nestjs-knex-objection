import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import knexConnection from './db-config';
import { Model } from 'objection';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  Model.knex(knexConnection);
  await app.listen(3000);
}
bootstrap();
