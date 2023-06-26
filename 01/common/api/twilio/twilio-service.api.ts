import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';

import { TwilioServiceApiConfigProvider } from '../config/twilio-config.provider';

import { SendMessageParams } from './params/send-message.params';

export interface TwilioServiceApiConfig {
  accountSid: string;
  authToken: string;
}

@Injectable()
export class TwilioServiceApi {
  private readonly twilioClient: twilio.Twilio;
  private readonly twilioConfig: TwilioServiceApiConfig;

  constructor(private readonly twilioConfigProvider: TwilioServiceApiConfigProvider) {
    this.twilioConfig = this.twilioConfigProvider.getConfig();
    this.twilioClient = twilio(
      this.twilioConfig.accountSid,
      this.twilioConfig.authToken,
      { lazyLoading: true }
    );
  }

  async sendMessage(params: SendMessageParams): Promise<MessageInstance> {
    return await this.twilioClient.messages.create({
      to: `+${params.to}`,
      from: params.from,
      body: params.body,
    });
  }
}
