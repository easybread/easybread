import { reset } from 'drizzle-seed';

import { saasdb } from '../saasdb';

import * as schema from './seedSchema';

async function main() {
  await reset(saasdb, schema);
}

main()
  .then(() => console.log('done'))
  .catch(console.error)
  .finally(() => process.exit(0));
