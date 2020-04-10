import { Organization } from 'schema-dts';

import { BreezyCompany } from '../interfaces';

export const breezyCompanyToOrganizationTransform = (
  company: BreezyCompany
): Organization => {
  const {
    _id,
    // creation_date,
    // friendly_id,
    initial,
    // member_count,
    name
    // updated_date
  } = company;

  const result: Organization = { '@type': 'Organization' };

  return Object.assign({}, result, {
    name,
    // TODO: better schema property for initial
    alternateName: initial,
    identifier: _id
    // TODO: schema properties for other fields;
  });
};
