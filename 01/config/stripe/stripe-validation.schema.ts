import * as jo from 'joi';

export const stripeValidationSchema = {
  STRIPE_PUBLISHABLE_KEY: jo.string().required(),
  STRIPE_SECRET_KEY: jo.string().required(),
};
