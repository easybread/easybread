import {
  BreadOperationHandler,
  createSuccessfulOutputWithRawDataAndPayload
} from '@easybread/core';

import { BreezyAuthStrategy } from '../breezy.auth-strategy';
import { BreezyOperationName } from '../breezy.operation-name';
import { BreezyCompanyMapper } from '../data-mappers';
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
      url: 'https://api.breezy.hr/v3/companies'
    });

    const companyMapper = new BreezyCompanyMapper();

    return createSuccessfulOutputWithRawDataAndPayload(
      BreezyOperationName.COMPANY_SEARCH,
      result.data,
      result.data.map(company => companyMapper.toSchema(company))
    );
  }
};
