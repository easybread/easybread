import { BreadOperationHandler } from '@easybread/core';

import { BreezyAuthStrategy } from '../breezy.auth-strategy';
import { BreezyOperationName } from '../breezy.operation-name';
import { BreezyCompany } from '../interfaces';
import { BreezyCompanySearchOperation } from '../operations';
import { breezyCompanyToOrganizationTransform } from '../tansform';

export const BreezyCompanySearchHandler: BreadOperationHandler<
  BreezyCompanySearchOperation,
  BreezyAuthStrategy
> = {
  name: BreezyOperationName.COMPANY_SEARCH,

  async handle(_input, context) {
    const result = await context.httpRequest<BreezyCompany[]>({
      method: 'GET',
      url: 'https://api.breezy.hr/v3/companies'
    });

    return {
      name: BreezyOperationName.COMPANY_SEARCH,
      payload: result.data.map(breezyCompanyToOrganizationTransform),
      rawPayload: { success: true, data: result.data }
    };
  }
};
