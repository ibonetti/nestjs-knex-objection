import { Global, Module, Provider } from '@nestjs/common';
import { Task } from './models/tasks';
import { User } from './models/auth';
import { ObjectionModule } from '@willsoto/nestjs-objection';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ObjectionModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          config: {
            client: 'postgresql',
            connection: {
              host: config.get('DB_HOST'),
              port: config.get('DB_PORT'),
              user: config.get('DB_USERNAME'),
              password: config.get('DB_PASSWORD'),
              database: config.get('DB_DATABASE'),
            },
            migrations: {
              directory: './src/database/migrations',
            },
            debug: false,
          },
        };
      },
    }),
    ObjectionModule.forFeature([Task, User]),
  ],
  //providers: [...providers],
  //exports: [...providers],
  exports: [ObjectionModule],
})
export class DatabaseModule {}
