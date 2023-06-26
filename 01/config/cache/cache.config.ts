import { registerAs } from '@nestjs/config';

export default registerAs('cache', () => ({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
}));
