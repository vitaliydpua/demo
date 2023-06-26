import { StripeServiceApiConfig } from '@inft-common/api/stripe/stripe-service.api';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


import { ConfigProvider } from './config-api.provider';

@Injectable()
export class StripeServiceApiConfigProvider extends ConfigProvider<StripeServiceApiConfig> {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  getConfig(): StripeServiceApiConfig {
    return {
      publishableKey: this.configService.get<string>('stripe.publishableKey'),
      secretKey: this.configService.get<string>('stripe.secretKey'),
    };
  }
}
