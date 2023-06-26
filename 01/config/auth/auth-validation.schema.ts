import * as jo from 'joi';

export const authValidationSchema = {
  JWT_EXPIRATION_TIME: jo.string().required(),
  RT_EXPIRATION_TIME: jo.string().required(),
  JWT_SECRET: jo.string().required(),
  AUTH_TOKEN_TTL: jo.string().required(),
};
