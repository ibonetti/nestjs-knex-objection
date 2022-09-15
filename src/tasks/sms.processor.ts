import {
  Processor,
  Process,
  OnQueueActive,
  OnQueueError,
  OnQueueFailed,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';
import { MessagingService } from '../messaging/messaging.service';
import { TaskSmsInterface } from './dto/task-sms.interface';

@Processor('sms')
export class SmsConsumer {
  private logger = new Logger('SmsConsumer');
  constructor(private messagingService: MessagingService) {}

  @Process('tasksms')
  async sendSms(job: Job<TaskSmsInterface>): Promise<MessageInstance> {
    const { username, taskTitle, taskDescription, phoneNumber } = job.data;

    const msg = `Hi ${username}. You've got a new task "${taskTitle}": ${taskDescription}`;

    return this.messagingService.sendSms(msg, phoneNumber);
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.verbose(
      `Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(
        job.data,
      )}...`,
    );
  }

  @OnQueueError()
  onError(error: Error) {
    this.logger.error(`SMS queue error: ${error.message}`);
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} failed. Reason: ${error.message}`);
  }
}
