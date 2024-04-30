import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { IMailOpts } from './nodemailer.interface';

@Injectable()
export class NodemailerService {
  constructor(private readonly mailerService: MailerService) {}
  async sendMail(mailOpts: IMailOpts): Promise<void> {
    try {
      await this.mailerService.sendMail({
        from: '"Blog App" <blog-app@blog.com>',
        ...mailOpts,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
