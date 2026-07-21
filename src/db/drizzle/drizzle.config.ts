import { defineConfig } from 'drizzle-kit';
import { isDrizzleDataValid } from './drizzle.validation';

const validatedEnv = isDrizzleDataValid();

// const url = `postgresql://${validatedEnv.DATABASE_USERNAME}:${validatedEnv.DATABASE_PASSWORD}@${validatedEnv.DATABASE_HOST}:${validatedEnv.DATABASE_PORT}/${validatedEnv.DATABASE_NAME}`;
const url =
  validatedEnv.MODE === 'DEV'
    ? validatedEnv.DEV_DATABASE_URL
    : validatedEnv.PROD_DATABASE_URL;

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
    url,
    ssl: validatedEnv.MODE === 'DEV' ? false : true,
  },
});
