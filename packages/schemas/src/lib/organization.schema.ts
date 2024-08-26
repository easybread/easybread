import { BreadSchema } from './bread.schema';

export type OrganizationSchema = BreadSchema & {
  '@type': 'Organization';
  alternateName?: string;
  numberOfEmployees?: number;
};
