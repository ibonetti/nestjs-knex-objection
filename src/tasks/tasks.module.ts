import { Module } from '@nestjs/common';
import { MessagingModule } from '../messaging/messaging.module';
import { AuthModule } from '../auth/auth.module';
import { TasksController } from './tasks.controller';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';
import { BullModule } from '@nestjs/bull';
import { SmsConsumer } from './sms.processor';

@Module({
  controllers: [TasksController],
  providers: [TasksService, TasksRepository, SmsConsumer],
  imports: [
    AuthModule,
    MessagingModule,
    BullModule.registerQueue({ name: 'sms' }),
  ],
})
export class TasksModule {}
