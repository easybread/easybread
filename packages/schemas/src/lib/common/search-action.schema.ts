import type { ExtendableSchema } from '../util/extendable-schema';

import type { ActionSchema } from './action.schema';

export type SearchActionSchema = ExtendableSchema<ActionSchema> & {
  '@type': 'SearchAction';
  query?: string;
};
