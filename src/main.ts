import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { configureRouting } from './configs/routing.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

// For validating DTOs
const globalValidationPipe = (app: INestApplication) => {
  const vp = new ValidationPipe({
    whitelist: true,
    transform: true,
    disableErrorMessages: false, // we should make it true in Production
    forbidNonWhitelisted: true,
  });
  app.useGlobalPipes(vp);
};

const handleCors = (app: INestApplication) => {
  const origin =
    process.env.MODE === 'DEV'
      ? ['http://localhost:5173', 'http://localhost:5174']
      : [process.env.FRONTEND_URL, process.env.STORE_URL];
  app.enableCors({
    // 1. Specify your explicit frontend local or production origins
    origin,

    // 2. Allowed HTTP interaction verbs
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',

    // 3. Allows Ky / Axios client token injection headers to pass through
    allowedHeaders: ['Content-Type', 'Authorization'],

    // // 4. Set to true if your authentication utilizes HttpOnly Cookies/Sessions
    // credentials: true,
  });
};

// TODO: Add  descriptions and define request and response for all endpoints
const setupApiDocs = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Order Management Docs')
    .setDescription('Order management api documentation')
    .setVersion('1.0')
    // .addTag('cats')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/docs',
    apiReference({
      content: document,
    }),
  );
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  handleCors(app);
  configureRouting(app);
  globalValidationPipe(app);
  setupApiDocs(app);
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
