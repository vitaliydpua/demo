import * as jo from 'joi';

import { AppEnvironment } from '../../common/shared/enums/app-environment.enum';

export const appValidationSchema = {
  APP_PORT: jo.number().default(3000),
  APP_HOST: jo.string().default('localhost'),
  HOSTNAME: jo.string().required(),
  APP_VERSION: jo.string(),
  NODE_ENV: jo
    .string()
    .valid(...Object.values(AppEnvironment))
    .default(AppEnvironment.Development),
};
