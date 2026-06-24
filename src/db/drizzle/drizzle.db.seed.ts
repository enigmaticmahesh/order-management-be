import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schemas';
import { isDrizzleDataValid } from './drizzle.validation';

async function main() {
  console.log('🌱 Starting database seeding...');
  const validatedEnv = isDrizzleDataValid();
  const connectionString =
    validatedEnv.MODE === 'DEV'
      ? validatedEnv.DEV_DATABASE_URL
      : validatedEnv.PROD_DATABASE_URL;
  const pool = new Pool({
    // host: validatedEnv.DATABASE_HOST,
    // port: Number(validatedEnv.DATABASE_PORT),
    // user: validatedEnv.DATABASE_USERNAME,
    // password: validatedEnv.DATABASE_PASSWORD,
    // database: validatedEnv.DATABASE_NAME,
    connectionString,
    ssl: validatedEnv.MODE === 'DEV' ? false : true,
  });
  const db = drizzle(pool, { schema });

  await db
    .insert(schema.roles)
    .values([{ name: 'admin' }, { name: 'user' }])
    .onConflictDoNothing();

  console.log('✅ Seeding completed successfully!');
  await pool.end();
}

main().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
