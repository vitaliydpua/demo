import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerConfigService {
    constructor(private readonly configService: ConfigService) {}

    get confirmLink(): string {
        return this.configService.get<string>('mailer.confirm_email_link')!;
    }

    get pinTtl(): number {
        return this.configService.get<number>('mailer.pin_ttl')!;
    }

    public get senderEmail(): string {
        return this.configService.get<string>('mailer.sender_email')!;
    }

    public get emailSubject(): string {
        return this.configService.get<string>('mailer.email_subject')!;
    }

    public get sendGridApiKey(): string {
        return this.configService.get<string>('mailer.send_grid_api_key')!;
    }
}
