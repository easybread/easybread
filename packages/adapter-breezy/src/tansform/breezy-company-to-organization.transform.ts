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
    // eslint-disable-next-line @typescript-eslint/camelcase
    member_count,
    name
    // updated_date
  } = company;

  const result: Organization = { '@type': 'Organization' };

  return {
    ...result,
    name,
    // TODO: better schema property for initial
    alternateName: initial,
    identifier: _id,
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      // eslint-disable-next-line @typescript-eslint/camelcase
      value: member_count
    }
    // TODO: schema properties for other fields;
  };
};
