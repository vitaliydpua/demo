import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class AuthConfigService implements JwtOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.configService.get<string>('auth.jwt_secret'),
      signOptions: {
        expiresIn: this.configService.get<string>('auth.jwt_expiration_time'),
      },
    };
  }

  get jwtSecret(): string {
    return this.configService.get<string>('auth.jwt_secret')!;
  }

  get rtExpirationTime(): string {
    return this.configService.get<string>('auth.rt_expiration_time')!;
  }

  get authTokenTtl(): number {
    return this.configService.get<number>('auth.auth_token_ttl')!;
  }
}
