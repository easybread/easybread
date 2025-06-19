import { seed } from 'drizzle-seed';

import { saasdb } from '../saasdb';

import { sessions, users } from './seedSchema';

async function main() {
  await seed(saasdb, {
    users,
    sessions,
  });
}

main()
  .then(() => console.log('done'))
  .catch(console.error)
  .finally(() => process.exit(0));
