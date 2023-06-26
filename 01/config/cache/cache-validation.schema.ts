import * as jo from 'joi';

export const cacheValidationSchema = {
  REDIS_HOST: jo.string().default('localhost'),
  REDIS_PORT: jo.number().default(6379),
};
