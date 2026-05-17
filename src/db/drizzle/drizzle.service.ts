import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { join } from 'path';
import * as schema from './schemas';

@Injectable()
export class DrizzleService implements OnModuleInit, OnApplicationShutdown {
  private db!: NodePgDatabase<typeof schema>;
  private pool!: Pool;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.pool = new Pool({
      host: this.configService.get<string>('DATABASE_HOST'),
      port: Number(this.configService.get<string>('DATABASE_PORT')),
      user: this.configService.get<string>('DATABASE_USERNAME'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_NAME'),
      max: 10, // Keep your explicit connection pool cap for the Admin backend
      idleTimeoutMillis: 30000, // Closes idle connections after 30 seconds
      connectionTimeoutMillis: 2000, // Crash quickly if the DB server is down
    });

    this.db = drizzle(this.pool, { schema });
    console.log(
      'Database strategy initialized successfully using a config object.',
    );

    // Automatically applies schema updates on application server startup! 🚀
    await migrate(this.db, {
      migrationsFolder: join(process.cwd(), 'src/db/drizzle/migrations'),
      // migrationsSchema: 'public', // ◄ Tells NestJS: Look for it inside public
      // migrationsTable: '__drizzle_migrations',
    }).catch((err) => {
      console.log('Programmatically migration error occured');
      console.error({ err });
    });
  }

  getDb(): NodePgDatabase<typeof schema> {
    return this.db;
  }

  getSchema(): typeof schema {
    return schema;
  }

  async onApplicationShutdown() {
    if (this.pool) {
      await this.pool.end();
      console.log('PostgreSQL connection pool safely closed.');
    }
  }
}
