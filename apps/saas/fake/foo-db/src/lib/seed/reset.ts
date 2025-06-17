import { reset } from 'drizzle-seed';

import { foodb } from '../foodb';

import * as enums from './../schema/enums';
import * as schema from './../schema/schema';

async function main() {
  await reset(foodb, { ...schema, ...enums });
}

main()
  .then(() => console.log('done'))
  .catch(console.error)
  .finally(() => process.exit(0));
