import { GoogleServiceApiConfigProvider } from '@inft-common/api/config/google-config.provider';
import { StripeServiceApiConfigProvider } from '@inft-common/api/config/stripe-config.provider';
import { TwilioServiceApiConfigProvider } from '@inft-common/api/config/twilio-config.provider';
import { GoogleServiceApi } from '@inft-common/api/google/google-service.api';
import { StripeServiceApi } from '@inft-common/api/stripe/stripe-service.api';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { AwsServiceApi } from './aws/aws-service.api';
import { AwsServiceApiConfigProvider } from './config/aws-config.provider';
import { TwilioServiceApi } from './twilio/twilio-service.api';

@Module({
    imports: [HttpModule],
    providers: [
        AwsServiceApi,
        AwsServiceApiConfigProvider,
        TwilioServiceApi,
        TwilioServiceApiConfigProvider,
        GoogleServiceApi,
        GoogleServiceApiConfigProvider,
        StripeServiceApi,
        StripeServiceApiConfigProvider,
    ],
    exports: [AwsServiceApi, TwilioServiceApi, GoogleServiceApi, StripeServiceApi],
})
export class ServicesApiModule {}
