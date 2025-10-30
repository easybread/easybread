import { lazyDrizzle } from '@space-architects/util-drizzle';
import { drizzle } from 'drizzle-orm/neon-serverless';

export const foodb = lazyDrizzle(
  drizzle,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  () => process.env['POSTGRES_FOO_CONN_URL']!,
);
