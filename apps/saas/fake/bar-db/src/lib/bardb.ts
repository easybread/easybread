import { drizzle } from 'drizzle-orm/neon-http';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const bardb = drizzle(process.env['POSTGRES_BAR_CONN_URL']!);
