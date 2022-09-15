import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MessagingService } from './messaging.service';

@Module({
  providers: [MessagingService],
  imports: [ConfigModule],
  exports: [MessagingService],
})
export class MessagingModule {}
