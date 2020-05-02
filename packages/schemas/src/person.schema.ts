import { BreadSchema } from './bread.schema';
import { OrganizationSchema } from './organization.schema';

export interface PersonSchema extends BreadSchema {
  '@type': 'Person';
  identifier?: string;
  gender?: string;
  givenName?: string;
  familyName?: string;
  jobTitle?: string;
  telephone?: string;
  email?: string;
  image?: string;
  workLocation?: string;
  additionalName?: string;
  honorificPrefix?: string;
  honorificSuffix?: string;
  worksFor?: OrganizationSchema;
}
