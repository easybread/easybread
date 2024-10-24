import type { BreadSchema } from './bread.schema';

/**
 * A listing that describes a job opening in a certain organization.
 *
 * TODO: Complete all fields for the JobPosting schema.
 */
export type JobPostingSchema = BreadSchema & {
  '@type': 'JobPosting';
  title?: string;
  datePosted?: string;
};
