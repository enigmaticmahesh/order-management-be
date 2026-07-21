import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
// import * as schema from './schemas';
import { isDrizzleDataValid } from './drizzle.validation';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { resolve } from 'path';

async function main() {
  console.log('🌱 Starting database migration...');
  const validatedEnv = isDrizzleDataValid();
  const connectionString =
    validatedEnv.MODE === 'DEV'
      ? validatedEnv.DEV_DATABASE_URL
      : validatedEnv.PROD_DATABASE_URL;
  const pool = new Pool({
    connectionString,
    ssl: validatedEnv.MODE === 'DEV' ? false : true,
    max: 1,
    connectionTimeoutMillis: 5000, // Forces the script to crash with an error if it cannot reach the DB in 5 seconds
  });

  const client = await pool.connect()
  try {
    const db = drizzle(client, { logger: true })
    const absoluteMigrationsPath = resolve(__dirname, './migrations');
    await migrate(db, { migrationsFolder: absoluteMigrationsPath })

    console.log('✅ Migrations completed successfully!');
  } catch(err) {
    console.error('❌ Migrations  failed inside:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
    process.exit(0); // Safely exits with success code
  }
}

main()
