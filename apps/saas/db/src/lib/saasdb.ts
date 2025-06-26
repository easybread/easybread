import { lazyDrizzle } from '@space-architects/util-drizzle';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { load } from 'ts-dotenv';

export const saasdb = lazyDrizzle(
  url => drizzle(url),
  () => load({ POSTGRES_SAAS_CONN_URL: String }).POSTGRES_SAAS_CONN_URL,
);
