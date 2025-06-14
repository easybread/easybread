import { reset } from 'drizzle-seed';

import { foodb } from '../foodb';

import * as schema from './seedSchema';

async function main() {
  await reset(foodb, schema);
}

main()
  .then(() => console.log('done'))
  .catch(console.error)
  .finally(() => process.exit(0));
