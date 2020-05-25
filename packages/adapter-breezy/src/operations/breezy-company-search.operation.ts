import {
  BreadCollectionOperation,
  BreadCollectionOperationInput,
  BreadCollectionOperationOutputWithRawDataAndPayload
} from '@easybread/core';
import { OrganizationSchema } from '@easybread/schemas';

import { BreezyOperationName } from '../breezy.operation-name';
import { BreezyCompany } from '../interfaces';

export interface BreezyCompanySearchOperation
  extends BreadCollectionOperation<
    BreezyOperationName.COMPANY_SEARCH,
    'DISABLED'
  > {
  input: BreadCollectionOperationInput<BreezyOperationName.COMPANY_SEARCH>;
  output: BreadCollectionOperationOutputWithRawDataAndPayload<
    BreezyOperationName.COMPANY_SEARCH,
    BreezyCompany[],
    OrganizationSchema[]
  >;
}
