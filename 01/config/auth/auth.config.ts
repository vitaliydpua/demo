import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwt_expiration_time: process.env.JWT_EXPIRATION_TIME,
  rt_expiration_time: process.env.RT_EXPIRATION_TIME,
  jwt_secret: process.env.JWT_SECRET,
  auth_token_ttl: process.env.AUTH_TOKEN_TTL,
}));
