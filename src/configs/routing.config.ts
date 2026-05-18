import { INestApplication, VersioningType } from '@nestjs/common';

export function configureRouting(app: INestApplication): void {
  // 1. Set the global routing prefix
  app.setGlobalPrefix('api');

  // 2. Enable automatic URI versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
}
