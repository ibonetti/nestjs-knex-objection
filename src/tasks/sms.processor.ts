import { Processor, Process, OnQueueActive, OnQueueError } from '@nestjs/bull';
import { Job } from 'bull';
import { MessagingService } from '../messaging/messaging.service';
import { TaskSmsInterface } from './dto/task-sms.interface';

@Processor('sms')
export class SmsConsumer {
  constructor(private messagingService: MessagingService) {}

  @Process('tasksms')
  async sendSms(job: Job<TaskSmsInterface>) {
    const { username, taskTitle, taskDescription, phoneNumber } = job.data;

    const msg = `Hi ${username}. You've got a new task "${taskTitle}": ${taskDescription}`;
    Promise.resolve(this.messagingService.sendSms(msg, phoneNumber));
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueError()
  onError(error: Error) {
    console.log(error.message);
  }
}
