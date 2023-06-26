import {
  Injectable,
  CacheOptionsFactory,
  CacheModuleOptions,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as ioredisStore from 'cache-manager-ioredis';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  public createCacheOptions(): CacheModuleOptions {
    return {
      store: ioredisStore,
      host: this.configService.get<string>('cache.host'),
      port: this.configService.get<number>('cache.port'),
    };
  }
}
