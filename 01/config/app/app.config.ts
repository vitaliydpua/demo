import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  host: process.env.APP_HOST,
  hostname: process.env.HOSTNAME,
  port: process.env.APP_PORT,
  node_env: process.env.NODE_ENV,
  app_name: process.env.APP_NAME,
}));
