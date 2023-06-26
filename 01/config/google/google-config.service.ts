import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleConfigService {
  constructor(private readonly configService: ConfigService) {}
}
