import { OrganizationSchema } from '@easybread/schemas';

import { BreezyCompany } from '../interfaces';

export const breezyCompanyToOrganizationTransform = (
  company: BreezyCompany
): OrganizationSchema => {
  const {
    _id,
    // creation_date,
    // friendly_id,
    initial,
    // eslint-disable-next-line @typescript-eslint/camelcase
    member_count,
    name
    // updated_date
  } = company;

  const result: OrganizationSchema = { '@type': 'Organization' };

  return {
    ...result,
    name,
    // TODO: better schema property for initial
    alternateName: initial,
    identifier: _id,
    numberOfEmployees: member_count
    // TODO: schema properties for other fields;
  };
};
