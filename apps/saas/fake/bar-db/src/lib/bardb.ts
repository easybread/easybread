import { lazyDrizzle } from '@space-architects/util-drizzle';
import { drizzle } from 'drizzle-orm/neon-http';

export const bardb = lazyDrizzle(
  drizzle,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  () => process.env['POSTGRES_BAR_CONN_URL']!,
);
