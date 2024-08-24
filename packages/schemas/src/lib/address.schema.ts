import { BreadSchema } from './bread.schema';

export type AddressSchema = BreadSchema & {
  '@type': 'PostalAddress';
  streetAddress?: string;
  postalCode?: string;
  postOfficeBoxNumber?: string;
  addressCountry?: string;
  addressRegion?: string;
  addressLocality?: string;
};
