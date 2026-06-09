import { defineConfig } from 'drizzle-kit';
import { isDrizzleDataValid } from './drizzle.validation';
// import { join } from 'path';

const validatedEnv = isDrizzleDataValid();

const url = `postgresql://${validatedEnv.DATABASE_USERNAME}:${validatedEnv.DATABASE_PASSWORD}@${validatedEnv.DATABASE_HOST}:${validatedEnv.DATABASE_PORT}/${validatedEnv.DATABASE_NAME}`;

export default defineConfig({
  dialect: 'postgresql',
  // schema: join(process.cwd(), 'src/db/drizzle/schemas/index.ts'),
  // out: join(process.cwd(), 'src/db/drizzle/migrations'),
  schema: './src/db/drizzle/schemas/index.ts',
  out: './src/db/drizzle/migrations',
  // Instruct the CLI to keep the tracking table inside public 🚀
  //   migrations: {
  //     table: '__drizzle_migrations',
  //     schema: 'public',
  //   },
  dbCredentials: {
    // host: validatedEnv.DATABASE_HOST,
    // port: Number(validatedEnv.DATABASE_PORT),
    // user: validatedEnv.DATABASE_USERNAME,
    // password: validatedEnv.DATABASE_PASSWORD,
    // database: validatedEnv.DATABASE_NAME,
    // url is needed for cli migrate command to work,
    url,
  },
});
