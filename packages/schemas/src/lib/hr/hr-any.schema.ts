import type { JobPostingSchema } from './job-posting.schema';
import type { OrganizationSchema } from './organization.schema';

export type HrAnySchema = JobPostingSchema | OrganizationSchema;
