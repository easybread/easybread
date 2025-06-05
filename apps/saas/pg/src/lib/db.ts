import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const client = postgres(process.env['POSTGRES_DB_URL']!, { prepare: false });
export const db = drizzle({ client });
