import { AddressSchema } from './address.schema';
import { Bcp47LanguageCode } from './bcp47-language-code';
import { BreadSchema } from './bread.schema';
import { OrganizationSchema } from './organization.schema';

export type PersonSchema = BreadSchema & {
  '@type': 'Person';
  // TODO: think about allowing any string
  knowsLanguage?: Bcp47LanguageCode;
  address?: AddressSchema | string;
  alternateName?: string;
  givenName?: string;
  familyName?: string;
  additionalName?: string;
  honorificPrefix?: string;
  honorificSuffix?: string;
  password?: string;
  gender?: string;
  jobTitle?: string;
  telephone?: string;
  email?: string;
  image?: string;
  workLocation?: string;
  worksFor?: OrganizationSchema;
  birthDate?: string;
};
