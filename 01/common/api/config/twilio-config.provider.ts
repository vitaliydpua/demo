import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TwilioServiceApiConfig } from '../twilio/twilio-service.api';

import { ConfigProvider } from './config-api.provider';

@Injectable()
export class TwilioServiceApiConfigProvider extends ConfigProvider<TwilioServiceApiConfig> {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  getConfig(): TwilioServiceApiConfig {
    return {
      accountSid: this.configService.get<string>('twilio.account_sid')!,
      authToken: this.configService.get<string>('twilio.auth_token')!,
    };
  }
}
