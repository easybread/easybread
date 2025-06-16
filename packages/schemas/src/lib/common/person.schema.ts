import { ThingSchema } from '../base/thing.schema';
import { OrganizationSchema } from '../hr/organization.schema';
import type { ExtendableSchema } from '../util/extendable-schema';

import { Bcp47LanguageCode } from './bcp47-language-code';
import { PostalAddressSchema } from './postal-address.schema';

export type PersonSchema = ExtendableSchema<ThingSchema> & {
  '@type': 'Person';
  // TODO: think about allowing any string
  knowsLanguage?: Bcp47LanguageCode;
  address?: PostalAddressSchema | string;
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

  // Not in the spec;
  // TODO: move to custom @context
  emailVerified?: boolean;
  telephoneVerified?: boolean;
};
