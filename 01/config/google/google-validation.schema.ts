import * as jo from 'joi';

export const googleValidationSchema = {
  GOOGLE_API_KEY: jo.string().required(),
};
