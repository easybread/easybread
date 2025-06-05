import { seed } from 'drizzle-seed';

import { db } from '../db';

import { sessions, users } from './seedSchema';

async function main() {
  await seed(db, {
    users,
    sessions,
  });
}

main()
  .then(() => console.log('done'))
  .catch(console.error)
  .finally(() => process.exit(0));
