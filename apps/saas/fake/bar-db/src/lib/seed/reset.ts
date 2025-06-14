import { reset } from 'drizzle-seed';

import { bardb } from '../bardb';

import * as schema from './seedSchema';

async function main() {
  await reset(bardb, schema);
}

main()
  .then(() => console.log('done'))
  .catch(console.error)
  .finally(() => process.exit(0));
