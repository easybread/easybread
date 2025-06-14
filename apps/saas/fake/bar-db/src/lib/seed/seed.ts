import { seed } from 'drizzle-seed';

import { bardb } from '../bardb';

import { sessions, users } from './seedSchema';

async function main() {
  await seed(bardb, {
    users,
    sessions,
  });
}

main()
  .then(() => console.log('done'))
  .catch(console.error)
  .finally(() => process.exit(0));
