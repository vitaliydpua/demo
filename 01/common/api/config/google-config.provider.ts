import { GoogleServiceApiConfig } from '@inft-common/api/google/google-service.api';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


import { ConfigProvider } from './config-api.provider';

@Injectable()
export class GoogleServiceApiConfigProvider extends ConfigProvider<GoogleServiceApiConfig> {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  getConfig(): GoogleServiceApiConfig {
    return {
      apiKey: this.configService.get<string>('google.apiKey'),
    };
  }
}
