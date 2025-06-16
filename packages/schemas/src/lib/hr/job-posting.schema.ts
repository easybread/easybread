import type { ThingSchema } from '../base/thing.schema';
import type { PostalAddressSchema } from '../common/postal-address.schema';
import type { ExtendableSchema } from '../util/extendable-schema';

import type { OrganizationSchema } from './organization.schema';

export type JobCountryRequirementSchema = {
  '@type': 'Country';
  name: string;
  sameAs?: string;
};

export type JobMonetaryAmountSchema = {
  '@type': 'MonetaryAmount';
  value: number;
  currency: string;
  unitText?: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
};

export type JobSalaryRangeSchema = {
  '@type': 'MonetaryAmountDistribution';
  minValue?: number;
  maxValue?: number;
  currency: string;
  unitText?: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
};

export type JobEducationRequirementSchema = {
  '@type': 'EducationalOccupationalCredential';
  credentialCategory: string;
  about?: string;
  recognizedBy?: OrganizationSchema;
};

export type JobExperienceRequirementSchema = {
  '@type': 'OccupationalExperienceRequirements';
  monthsOfExperience?: number;
  description?: string;
};

export type JobCategorySchema = {
  '@type': 'CategoryCode';
  codeValue: string;
  name: string;
  url?: string;
};

export type JobContactPointSchema = {
  '@type': 'ContactPoint';
  email?: string;
  telephone?: string;
  contactType?: string;
};

export type JobEmploymentTypeEnum =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'CONTRACTOR'
  | 'TEMPORARY'
  | 'SEASONAL'
  | 'INTERN'
  | 'VOLUNTEER'
  | 'PER_DIEM';

export type JobLocationTypeEnum = 'TELECOMMUTE' | 'ONSITE' | 'HYBRID';

/**
 * A listing that describes a job opening in a certain organization.
 * Based on Schema.org JobPosting (https://schema.org/JobPosting)
 */
export type JobPostingSchema = ExtendableSchema<ThingSchema> & {
  '@type': 'JobPosting';

  // Core fields
  title: string; // Required
  description?: string;
  datePosted?: string; // Date
  validThrough?: string; // Date

  // Organization & Location
  hiringOrganization?: OrganizationSchema;
  employmentUnit?: OrganizationSchema; // Department/unit where the employee reports
  jobLocation?: PostalAddressSchema;
  applicantLocationRequirements?: JobCountryRequirementSchema;

  // Employment Details
  employmentType?: Array<JobEmploymentTypeEnum>;
  jobLocationType?: JobLocationTypeEnum;
  workHours?: string;

  // Compensation & Benefits
  baseSalary?: JobMonetaryAmountSchema;
  estimatedSalary?: JobSalaryRangeSchema;
  incentiveCompensation?: string;
  jobBenefits?: string;

  // Requirements & Qualifications
  educationRequirements?: JobEducationRequirementSchema;
  experienceRequirements?: JobExperienceRequirementSchema;
  experienceInPlaceOfEducation?: boolean;
  qualifications?: string;
  skills?: string;
  responsibilities?: string;

  // Industry & Occupation
  industry?: string;
  occupationalCategory?: JobCategorySchema;

  // Application Process
  applicationContact?: JobContactPointSchema;
  directApply?: boolean;
  jobImmediateStart?: boolean;
  applicationDeadline?: string; // Date

  // Additional Details
  eligibilityToWorkRequirement?: string;
  employerOverview?: string;
  numberOfPositions?: number;
  specialCommitments?: string;
};
