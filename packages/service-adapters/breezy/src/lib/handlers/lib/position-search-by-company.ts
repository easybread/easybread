import { BreadException, CommandContext } from '@easybread/core';

import type { BreezyAuthStrategy } from '../../breezy.auth-strategy';
import type { BreezyPosition } from '../../interfaces';

import { BREEZY_API_BASE } from './breezy.api-base';

export async function positionSearchByCompany(
  companyId: string,
  context: CommandContext<BreezyAuthStrategy>,
) {
  const result = await context.httpRequest<BreezyPosition[]>({
    method: 'GET',
    url: `${BREEZY_API_BASE}/company/${companyId}/positions`,
    params: { state: 'published' },
  });

  if (result.status !== 200) {
    throw new BreadException('breezy position search failed');
  }

  return result.data;
}
