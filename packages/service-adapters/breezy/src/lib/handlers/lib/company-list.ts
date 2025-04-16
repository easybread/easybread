import { BreadException, CommandContext } from '@easybread/core';

import type { BreezyAuthStrategy } from '../../breezy.auth-strategy';
import { BreezyCompany } from '../../interfaces';

export async function companyList(context: CommandContext<BreezyAuthStrategy>) {
  const result = await context.httpRequest<BreezyCompany[]>({
    method: 'GET',
    url: 'https://api.breezy.hr/v3/companies',
  });

  if (result.status !== 200) {
    throw new BreadException('breezy company search failed', {
      cause: result.statusText,
    });
  }

  return result.data;
}
