import { BreadSchema } from './bread.schema';

export interface OrganizationSchema extends BreadSchema {
  '@type': 'Organization';
  alternateName?: string;
  numberOfEmployees?: number;
}
