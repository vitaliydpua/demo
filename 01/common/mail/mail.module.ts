import { MailerConfigService } from '@inft-config/mailer/emailer.config.service';
import { Module } from '@nestjs/common';

import { MailService } from './mail.service';
import { AppConfigService } from "@inft-config/app/app-config.service";

@Module({
    providers: [MailService, MailerConfigService, AppConfigService],
    exports: [MailService, MailerConfigService],
})
export class MailModule {}
