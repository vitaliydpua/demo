import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwilioConfigService {
  constructor(private readonly configService: ConfigService) {}

  public get senderPhoneNumber(): string {
    return this.configService.get<string>('twilio.sender_phone_number')!;
  }

  public get senderName(): string {
    return this.configService.get<string>('twilio.sender_name')!;
  }

  public get pinTtl(): number {
    return this.configService.get<number>('twilio.pin_ttl')!;
  }
}
