import { Injectable } from '@nestjs/common';
import { NotifyNewTaskDto } from './dto/notify-newtask.dto';
import { Twilio } from 'twilio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MessagingService {
  constructor(private config: ConfigService) {}

  sendSms(message: string, phoneNumber: string) {
    const accountSid = this.config.get('TWILIO_ACCOUNT_SID');
    const authToken = this.config.get('TWILIO_AUTH_TOKEN');

    if (!accountSid || !authToken) return;

    const client = new Twilio(accountSid, authToken);

    client.messages
      .create({
        body: message,
        from: '+12564083682',
        to: phoneNumber,
      })
      .then((message) => console.log(message.sid))
      .catch((err) => console.log(err));
  }

  sendNewtaskSmsToUser(notifyDto: NotifyNewTaskDto) {
    const { user, task } = notifyDto;

    const msg = `Hi ${user.username}. You've got a new task "${task.title}": ${task.description}`;
    console.log(`SMS ==> ${msg}`);

    this.sendSms(msg, user.phone_number);
  }
}
