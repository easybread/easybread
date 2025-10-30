import { defineConfig } from 'drizzle-kit';
import { load } from 'ts-dotenv';

const { POSTGRES_FOO_CONN_URL } = load({ POSTGRES_FOO_CONN_URL: String });
export default defineConfig({
  out: './drizzle',
  schema: './src/lib/schema',
  dialect: 'postgresql',
  dbCredentials: { url: POSTGRES_FOO_CONN_URL },
});
