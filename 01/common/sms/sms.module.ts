import { ServicesApiModule } from '@inft-common/api/services-api.module';
import { TwilioConfigService } from '@inft-config/twilio/twilio-config.service';
import { Global, Module } from '@nestjs/common';

import { SmsService } from './services/sms.service';


@Global()
@Module({
  imports: [ServicesApiModule],
  exports: [SmsService, TwilioConfigService],
  providers: [SmsService, TwilioConfigService],
})
export class SmsModule {}
