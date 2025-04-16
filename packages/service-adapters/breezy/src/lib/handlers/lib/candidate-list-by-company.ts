import { CommandContext } from '@easybread/core';

import type { BreezyAuthStrategy } from '../../breezy.auth-strategy';

import { candidateListByCompanyPosition } from './candidate-list-by-company-position';
import { positionSearchByCompany } from './position-search-by-company';

export async function candidateListByCompany(
  companyId: string,
  context: CommandContext<BreezyAuthStrategy>,
) {
  const positions = await positionSearchByCompany(companyId, context);

  const candidates = await Promise.all(
    positions.map(p => {
      return candidateListByCompanyPosition(
        companyId,
        p._id,

        // if we want to be able to paginate from the outside, we'll need to
        // keep track of the pagination for each position and pass it through...
        // can be quite tricky
        { page: 1, page_size: 50, sort: 'created' },
        context,
      );
    }),
  );

  return candidates.flat();
}
