import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err: Error) => {
  console.error('PG idle client error', err);
  process.exit(-1);
});
