import { Injectable, Logger } from '@nestjs/common';
import { NotifyNewTaskDto } from './dto/notify-newtask.dto';
import { Twilio } from 'twilio';
import { ConfigService } from '@nestjs/config';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';

@Injectable()
export class MessagingService {
  private logger = new Logger('MessagingService');
  constructor(private config: ConfigService) {}

  async sendSms(
    message: string,
    phoneNumber: string,
  ): Promise<MessageInstance> {
    const accountSid = this.config.get('TWILIO_ACCOUNT_SID');
    const authToken = this.config.get('TWILIO_AUTH_TOKEN');

    if (!accountSid || !authToken) return;

    const client = new Twilio(accountSid, authToken);

    return await client.messages.create({
      body: message,
      from: '+12564083682', //'+12564083682'
      to: phoneNumber,
    });
    //.then((message) => console.log(message.sid))
    //.catch((err) => console.log(err));
  }

  sendNewtaskSmsToUser(notifyDto: NotifyNewTaskDto) {
    const { user, task } = notifyDto;

    const msg = `Hi ${user.username}. You've got a new task "${task.title}": ${task.description}`;
    this.logger.debug(`SMS ==> ${msg}`);

    this.sendSms(msg, user.phone_number);
  }
}
