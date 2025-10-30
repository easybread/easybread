import { seed } from 'drizzle-seed';

import { bardb } from '../bardb';

import { seedSchema } from './seedSchema';

async function main() {
  await seed(bardb, seedSchema);
}

main()
  .then(() => console.log('done'))
  .catch(console.error)
  .finally(() => process.exit(0));
