import type { PersonSchema } from './person.schema';
import type { ActionSchema } from './action.schema';
import type { AddressSchema } from './address.schema';
import type { ApplyActionSchema } from './apply-action.schema';
import type { OrganizationSchema } from './organization.schema';
import type { JobPostingSchema } from './job-posting.schema';
import type { RatingSchema } from './rating.schema';

export type AnySchema =
  | ActionSchema
  | AddressSchema
  | ApplyActionSchema
  | JobPostingSchema
  | OrganizationSchema
  | PersonSchema
  | RatingSchema;
