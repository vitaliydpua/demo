import * as jo from 'joi';

export const databaseValidationSchema = {
  DB_HOST: jo.string().default('localhost'),
  DB_PORT: jo.number().default(5432),
  DB_NAME: jo.string(),
  DB_USERNAME: jo.string(),
  DB_PASSWORD: jo.string(),
};
