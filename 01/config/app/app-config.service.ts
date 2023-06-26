import { AppEnvironment } from '@inft-common/shared/enums/app-environment.enum';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get port(): number {
    return this.configService.get<number>('app.port')!;
  }

  get host(): string {
    return this.configService.get<string>('app.host')!;
  }

  get hostname(): string {
    return this.configService.get<string>('app.hostname')!;
  }

  get nodeEnv(): string {
    return this.configService.get<string>('app.node_env')!;
  }

  get appName(): string {
    return this.configService.get<string>('app.app_name')!;
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === AppEnvironment.Development;
  }
}
