import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as schema from './schema';

async function runMigrations() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool, { schema });

  console.log('Running migrations...');

  await migrate(db, { migrationsFolder: './server/db/migrations' });

  console.log('Migrations completed');

  await pool.end();
}

runMigrations().catch((err) => {
  console.error('Migration failed', err);
  process.exit(1);
}); 