import { ThingSchema } from '../base/thing.schema';
import type { ExtendableSchema } from '../util/extendable-schema';

export type OrganizationSchema = ExtendableSchema<ThingSchema> & {
  '@type': 'Organization';
  alternateName?: string;
  numberOfEmployees?: number;
};
