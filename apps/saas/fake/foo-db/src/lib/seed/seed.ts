import { seed } from 'drizzle-seed';

import { foodb } from '../foodb';

import * as seedSchema from './seedSchema';

async function main() {
  await seed(foodb, seedSchema).refine(ctx => {
    return {
      users: {},
    };
  });
}

main()
  .then(() => console.log('done'))
  .catch(console.error)
  .finally(() => process.exit(0));
