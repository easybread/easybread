import { CommandContext } from '@easybread/core';

import type { BreezyAuthStrategy } from '../../breezy.auth-strategy';

import { candidateListByCompany } from './candidate-list-by-company';
import { companyList } from './company-list';

export async function candidateListAll(
  context: CommandContext<BreezyAuthStrategy>,
) {
  const companies = await companyList(context);

  const results = await Promise.all(
    companies.map(c => (c._id ? candidateListByCompany(c._id, context) : [])),
  );

  return results.flat();
}
