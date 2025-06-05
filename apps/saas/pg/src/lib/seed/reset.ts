import { reset } from 'drizzle-seed';

import { db } from '../db';

import * as schema from './seedSchema';

async function main() {
  await reset(db, schema);
}

main()
  .then(() => console.log('done'))
  .catch(console.error)
  .finally(() => process.exit(0));
