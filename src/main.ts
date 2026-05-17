import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// For validating DTOs
const globalValidationPipe = () => {
  const vp = new ValidationPipe({
    whitelist: true,
    transform: true,
    disableErrorMessages: false, // we should make it true in Production
    forbidNonWhitelisted: true,
  });
  return vp;
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(globalValidationPipe());
  app.enableShutdownHooks();
  const PORT = process.env.PORT ? Number(process.env.PORT) : undefined;
  await app.listen(PORT ?? 3001);
}
bootstrap();

/*
  INITIAL SETUP:
    Node version: >= v22.14.0
    Build tool: pnpm v10.21.0
    Database: Postgres (Docker Image: postgres:17.4-alpine)
    NOTES:
      1. Before starting the app, run pnpm db:generate
      2. Run pnpm start:dev --> For Development
*/
