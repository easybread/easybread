import { AddressSchema } from './address.schema';
import { Bcp47LanguageCode } from './bcp47-language-code';
import { BreadSchema } from './bread.schema';
import { OrganizationSchema } from './organization.schema';

export interface PersonSchema extends BreadSchema {
  '@type': 'Person';
  // TODO: thnk about allowing any string
  knowsLanguage?: Bcp47LanguageCode;
  address?: AddressSchema | string;
  alternateName?: string;
  password?: string;
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
