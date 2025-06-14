import { seed } from 'drizzle-seed';

import { foodb } from '../foodb';

import { sessions, users } from './seedSchema';

async function main() {
  await seed(foodb, {
    users,
    sessions,
  });
}

main()
  .then(() => console.log('done'))
  .catch(console.error)
  .finally(() => process.exit(0));
