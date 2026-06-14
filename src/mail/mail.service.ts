import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { resetPasswordTemplate } from './templates/reset-password.template';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendPasswordResetEmail(
    to: string,
    rawToken: string,
  ): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONT_URL');
    const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;
    const expirationMinutes = 30;

    await this.mailerService.sendMail({
      to,
      subject: 'Recuperación de contraseña',
      html: resetPasswordTemplate({ resetUrl, expirationMinutes }),
    });
  }
}