import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AwsServiceApiConfig } from '../aws/aws-service.api';

import { ConfigProvider } from './config-api.provider';


@Injectable()
export class AwsServiceApiConfigProvider extends ConfigProvider<AwsServiceApiConfig>{
  constructor(private readonly configService: ConfigService) {
    super();
  }

  getConfig(): AwsServiceApiConfig {
    return {
      fullUrl: this.configService.get<string>('AWS_FULL_URL')!,
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY')!,
      rootBucket: this.configService.get<string>('AWS_ROOT_BUCKET')!,
      region: this.configService.get<string>('AWS_REGION')!,
    };
  }
}
