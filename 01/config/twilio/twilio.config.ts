import { registerAs } from '@nestjs/config';

export default registerAs('twilio', () => ({
  account_sid: process.env.TWILIO_ACCOUNT_SID,
  auth_token: process.env.TWILIO_AUTH_TOKEN,
  sender_phone_number: process.env.TWILIO_SENDER_PHONE_NUMBER,
  sender_name: process.env.TWILIO_SENDER_NAME,
  pin_ttl: process.env.TWILIO_PIN_TTL,
  registration_token_ttl: process.env.TWILIO_REGISTRATION_TOKEN_TTL,
}));
