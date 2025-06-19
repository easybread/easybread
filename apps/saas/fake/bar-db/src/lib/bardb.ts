import { lazyDrizzle } from '@space-architects/util-drizzle';
import { drizzle } from 'drizzle-orm/neon-http';
import { load } from 'ts-dotenv';

export const bardb = lazyDrizzle(
  drizzle,

  () => load({ POSTGRES_BAR_CONN_URL: String }).POSTGRES_BAR_CONN_URL,
);
