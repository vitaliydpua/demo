import * as jo from 'joi';

export const swaggerValidationSchema = {
  SWAGGER_PATH: jo.string(),
  SWAGGER_TITLE: jo.string(),
  SWAGGER_DESCRIPTION: jo.string(),
  APP_VERSION: jo.number(),
};
