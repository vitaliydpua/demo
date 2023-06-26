import * as jo from 'joi';

export const twilioValidationSchema = {
  TWILIO_ACCOUNT_SID: jo.string().regex(/^AC/).required(),
  TWILIO_AUTH_TOKEN: jo.string().required(),
  TWILIO_SENDER_NAME: jo.string().default('Hoozin'),
  TWILIO_SENDER_PHONE_NUMBER: jo.string().required(),
  TWILIO_PIN_TTL: jo.number().required(),
};
