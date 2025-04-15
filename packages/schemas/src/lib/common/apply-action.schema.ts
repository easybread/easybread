import type { ExtendableSchema } from '../util/extendable-schema';

import type { ActionSchema } from './action.schema';

export type ApplyActionSchema = ExtendableSchema<ActionSchema> & {
  '@type': 'ApplyAction';
};
