import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => ({
  path: process.env.SWAGGER_PATH,
  title: process.env.SWAGGER_TITLE,
  description: process.env.SWAGGER_DESCRIPTION,
}));
