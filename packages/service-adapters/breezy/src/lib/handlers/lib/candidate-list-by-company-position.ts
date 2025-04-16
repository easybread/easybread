import { BreadException, CommandContext } from '@easybread/core';

import type { BreezyAuthStrategy } from '../../breezy.auth-strategy';
import type { BreezyCandidate, BreezyPagination } from '../../interfaces';

import { BREEZY_API_BASE } from './breezy.api-base';

export async function candidateListByCompanyPosition(
  companyId: string,
  positionId: string,
  pagination: BreezyPagination,
  context: CommandContext<BreezyAuthStrategy>,
) {
  const result = await context.httpRequest<BreezyCandidate[]>({
    method: 'GET',
    url: `${BREEZY_API_BASE}/company/${companyId}/position/${positionId}/candidates`,
    params: pagination,
  });

  if (result.status !== 200) {
    throw new BreadException('breezy candidate get failed', {
      cause: result.statusText,
    });
  }

  return result.data;
}
