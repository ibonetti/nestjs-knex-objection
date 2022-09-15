import { Controller, Get, Res } from '@nestjs/common';
import { createReadStream } from 'fs';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/file')
  getFile(@Res() res) {
    const file = createReadStream(`${__dirname}/files/teste2.pkg`);
    console.log(__dirname);
    file.pipe(res);
  }
}
