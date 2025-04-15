import type { ThingSchema } from '../base/thing.schema';
import type { ExtendableSchema } from '../util/extendable-schema';

/**
 * A listing that describes a job opening in a certain organization.
 *
 * TODO: Complete all fields for the JobPosting schema.
 */
export type JobPostingSchema = ExtendableSchema<ThingSchema> & {
  '@type': 'JobPosting';
  title?: string;
  datePosted?: string;
};
