import type { ThingSchema } from '../base/thing.schema';
import type { PostalAddressSchema } from '../common/postal-address.schema';
import type { ExtendableSchema } from '../util/extendable-schema';

import type { OrganizationSchema } from './organization.schema';

export type PlaceSchema = {
  '@type': 'Place';
  name?: string;
  address?: PostalAddressSchema;
};

export type AdministrativeAreaSchema = {
  '@type': 'AdministrativeArea';
  name: string;
};

export type JobMonetaryAmountSchema = {
  '@type': 'MonetaryAmount';
  value: number;
  currency: string;
  unitText?: string;
};

export type MonetaryAmountDistributionSchema = {
  '@type': 'MonetaryAmountDistribution';
  median?: number;
  percentile10?: number;
  percentile25?: number;
  percentile75?: number;
  percentile90?: number;
  currency: string;
  duration?: string;
};

export type PriceSpecificationSchema = {
  '@type': 'PriceSpecification';
  price?: number;
  priceCurrency?: string;
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

export type OccupationSchema = {
  '@type': 'Occupation';
  name?: string;
};

export type JobContactPointSchema = {
  '@type': 'ContactPoint';
  email?: string;
  telephone?: string;
  contactType?: string;
};

/**
 * A listing that describes a job opening in a certain organization.
 * Based on Schema.org JobPosting (https://schema.org/JobPosting)
 * Strictly compliant - no extensions allowed.
 */
export type JobPostingSchema = ExtendableSchema<ThingSchema> & {
  '@type': 'JobPosting';

  // Required field
  title: string;

  // Optional fields (all from schema.org)
  description?: string;
  datePosted?: string; // Date
  validThrough?: string; // Date

  // Organization & Location
  hiringOrganization?: OrganizationSchema;
  jobLocation?: PlaceSchema | PostalAddressSchema;
  applicantLocationRequirements?: AdministrativeAreaSchema;

  // Employment Details
  employmentType?: string[];
  jobLocationTypes?: string[]; // Note: plural form per schema.org
  workHours?: string;

  // Compensation
  baseSalary?: JobMonetaryAmountSchema | number | PriceSpecificationSchema;
  estimatedSalary?:
    | MonetaryAmountDistributionSchema
    | JobMonetaryAmountSchema
    | number;
  salaryCurrency?: string;
  incentiveCompensation?: string;
  jobBenefits?: string;

  // Requirements
  educationalRequirements?: string | JobEducationRequirementSchema;
  experienceRequirements?: string | JobExperienceRequirementSchema;
  qualifications?: string;
  skills?: string;
  responsibilities?: string;

  // Industry & Occupation
  industry?: string;
  occupationalCategory?: string;
  relevantOccupation?: OccupationSchema;

  // Application
  applicationContact?: JobContactPointSchema;
  jobImmediateStart?: boolean;
  eligibilityToWorkRequirement?: string;
  totalJobOpenings?: number;
};
