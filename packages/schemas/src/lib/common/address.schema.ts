import { ThingSchema } from '../base/thing.schema';
import type { ExtendableSchema } from '../util/extendable-schema';

export type AddressSchema = ExtendableSchema<ThingSchema> & {
  '@type': 'PostalAddress';
  streetAddress?: string;
  postalCode?: string;
  postOfficeBoxNumber?: string;
  addressCountry?: string;
  addressRegion?: string;
  addressLocality?: string;
};
