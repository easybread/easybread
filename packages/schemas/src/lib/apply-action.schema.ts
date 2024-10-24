import type { ActionSchema } from './action.schema';
import type { ExtendableSchema } from './extendable-schema';

export type ApplyActionSchema = ExtendableSchema<ActionSchema> & {
  '@type': 'ApplyAction';
};
