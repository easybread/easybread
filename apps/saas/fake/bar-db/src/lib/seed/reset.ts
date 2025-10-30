import { reset } from 'drizzle-seed';

import { bardb } from '../bardb';

import { seedSchema } from './seedSchema';

async function main() {
  await reset(bardb, seedSchema);
}

main()
  .then(() => console.log('done'))
  .catch(console.error)
  .finally(() => process.exit(0));
