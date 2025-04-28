import { defineConfig } from 'drizzle-kit';
import { load } from 'ts-dotenv';

const { POSTGRES_DB_URL } = load({
  POSTGRES_DB_URL: String,
});
export default defineConfig({
  out: './drizzle',
  schema: './src/lib/schema',
  dialect: 'postgresql',
  dbCredentials: { url: POSTGRES_DB_URL },
});
