import {
  BreadOperation,
  BreadOperationInput,
  BreadOperationOutputWithRawDataAndPayload
} from '@easybread/core';
import { OrganizationSchema } from '@easybread/schemas';

import { BreezyOperationName } from '../breezy.operation-name';
import { BreezyCompany } from '../interfaces';

export interface BreezyCompanySearchOperation
  extends BreadOperation<BreezyOperationName.COMPANY_SEARCH> {
  input: BreadOperationInput<BreezyOperationName.COMPANY_SEARCH>;
  output: BreadOperationOutputWithRawDataAndPayload<
    BreezyOperationName.COMPANY_SEARCH,
    BreezyCompany[],
    OrganizationSchema[]
  >;
}
