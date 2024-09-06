import {
  BreadOperationHandler,
  createDisabledPagination,
  createSuccessfulCollectionOutputWithRawDataAndPayload,
} from '@easybread/core';

import { BreezyAuthStrategy } from '../breezy.auth-strategy';
import { BreezyOperationName } from '../breezy.operation-name';
import { breezyCompanyAdapter } from '../data-adapters';
import { BreezyCompany } from '../interfaces';
import { BreezyCompanySearchOperation } from '../operations';

export const BreezyCompanySearchHandler: BreadOperationHandler<
  BreezyCompanySearchOperation,
  BreezyAuthStrategy
> = {
  name: BreezyOperationName.COMPANY_SEARCH,

  async handle(_input, context) {
    const result = await context.httpRequest<BreezyCompany[]>({
      method: 'GET',
      url: 'https://api.breezy.hr/v3/companies',
    });

    return createSuccessfulCollectionOutputWithRawDataAndPayload(
      BreezyOperationName.COMPANY_SEARCH,
      result.data,
      result.data.map((company) => breezyCompanyAdapter.toInternal(company)),
      createDisabledPagination()
    );
  },
};
