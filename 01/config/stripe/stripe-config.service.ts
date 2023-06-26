import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeConfigService {
  constructor(private readonly configService: ConfigService) {}
}
