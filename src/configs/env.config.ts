import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

const schema = Joi.object({
  JWT_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.string().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  MODE: Joi.string().required(),
  FRONTEND_URL: Joi.string().required(),
});

export const EnvModule = ConfigModule.forRoot({
  isGlobal: true,
  validationSchema: schema,
  validationOptions: {
    allowUnknown: true,
    abortEarly: true,
  },
});
