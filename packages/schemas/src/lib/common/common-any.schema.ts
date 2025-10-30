import type { ActionSchema } from './action.schema';
import type { ApplyActionSchema } from './apply-action.schema';
import type { PersonSchema } from './person.schema';
import type { PostalAddressSchema } from './postal-address.schema';
import type { RatingSchema } from './rating.schema';
import type { SearchActionSchema } from './search-action.schema';

export type CommonAnySchema =
  | ActionSchema
  | SearchActionSchema
  | PostalAddressSchema
  | ApplyActionSchema
  | PersonSchema
  | RatingSchema;
