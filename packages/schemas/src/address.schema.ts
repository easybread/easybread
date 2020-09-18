import { BreadSchema } from './bread.schema';

export interface AddressSchema extends BreadSchema {
  '@type': 'PostalAddress';
  streetAddress?: string;
  postalCode?: string;
  postOfficeBoxNumber?: string;
  addressCountry?: string;
  addressRegion?: string;
  addressLocality?: string;
}
