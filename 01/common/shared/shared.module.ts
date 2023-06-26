import { AppConfigService } from '@inft-config/app/app-config.service';
import { CacheConfigService } from '@inft-config/cache/cache.service';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { RedisCacheService } from './services/cache.service';
import { GenerateDataService } from './services/generate-data.service';
import { HelpersService } from '@inft-common/shared/services/helpers.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthConfigService } from '@inft-config/auth/auth-config.service';

@Module({
    imports: [
        CacheModule.register({
            imports: [ConfigModule],
            useClass: CacheConfigService,
        }),
        CqrsModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useClass: AuthConfigService,
        }),
    ],
    exports: [CqrsModule, JwtModule, GenerateDataService, RedisCacheService, AppConfigService, HelpersService],
    providers: [GenerateDataService, RedisCacheService, AppConfigService, HelpersService],
})
export class SharedModule {}
