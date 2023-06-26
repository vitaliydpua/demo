import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SwaggerConfigService {
  constructor(private readonly configService: ConfigService) {}

  public get path(): string {
    return this.configService.get<string>('swagger.path')!;
  }

  public get title(): string {
    return this.configService.get<string>('swagger.title')!;
  }

  public get description(): string {
    return this.configService.get<string>('swagger.description')!;
  }
}
