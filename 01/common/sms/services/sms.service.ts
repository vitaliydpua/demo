import { TwilioServiceApi } from '@inft-common/api/twilio/twilio-service.api';
import { TwilioUnavailableError } from '@inft-common/error/custom-errors/sms/twilio-unavailable.error';
import { TwilioConfigService } from '@inft-config/twilio/twilio-config.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsService {
    constructor(
        private readonly twilioConfigService: TwilioConfigService,
        private readonly twilioService: TwilioServiceApi,
    ) {}

    async sendSms(phone: string, body: string): Promise<void> {
        try {
            await this.twilioService.sendMessage({
                to: phone,
                from: this.twilioConfigService.senderPhoneNumber,
                body,
            });
            console.log('SEND SMS', body);
        } catch (err) {
            console.error(err);
            throw new TwilioUnavailableError();
        }
    }
}
