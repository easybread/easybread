import { seed } from 'drizzle-seed';

import { bardb } from '../bardb';
import * as schema from '../schema/schema';

async function main() {
  await seed(bardb, schema);
}

main()
  .then(() => console.log('done'))
  .catch(console.error)
  .finally(() => process.exit(0));
