import { promises } from 'fs';

import { SendMailError } from '@inft-common/error/custom-errors/common/send-mail.error';
import { MailerConfigService } from '@inft-config/mailer/emailer.config.service';
import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import * as HandleBars from 'handlebars';
import { UserModel } from "@inft-app/users/models/user/user.model";
import { AppConfigService } from "@inft-config/app/app-config.service";


@Injectable()
export class MailService {
    private readonly templatesPath = 'src/common/mail/templates'

    constructor(
      private readonly mailConfigService: MailerConfigService,
      private readonly appConfigService: AppConfigService,
    ) {
        sgMail.setApiKey(this.mailConfigService.sendGridApiKey);
    }

    async sendVerificationCode(email: string, code: string): Promise<void> {
        await this.sendMailMessage(email, this.getTemplatePath('verification-code.hbs'), { code }).catch(console.error);
    }

    async sendConfirmEmail(user: UserModel): Promise<void> {
        if (this.appConfigService.isDevelopment) return;
        await this.sendMailMessage(user.email, this.getTemplatePath('email-confirm.hbs'), {
            confirmLink: `${this.appConfigService.hostname}/users/confirm-email/${user.id}`
        }).catch(console.error);
    }

    private getTemplatePath(templateName: string): string {
        return `${this.templatesPath}/${templateName}`;
    }

    private async sendMailMessage(email: string, templatePath: string, params: {}): Promise<void> {
        try {
            const html = await promises.readFile(templatePath, 'utf8');
            const renderTemplate = HandleBars.compile(html);
            const msg = {
                to: email,
                from: `<${this.mailConfigService.senderEmail}>`,
                subject: this.mailConfigService.emailSubject,
                html: renderTemplate(params),
            };
            await sgMail.send(msg);
        } catch (err) {
            (err?.response?.body?.errors || []).map((e) => {
                console.error(e);
            });
            throw new SendMailError();
        }
    }
}
