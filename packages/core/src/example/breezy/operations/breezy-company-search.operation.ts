import { Organization } from 'schema-dts';

import {
  BreadOperation,
  BreadOperationInput,
  BreadOperationOutputWithRawDataAndPayload
} from '../../../operation';
import { BreezyOperationName } from '../breezy.operation-name';
import { BreezyCompany } from '../interfaces';

export interface BreezyCompanySearchOperation
  extends BreadOperation<BreezyOperationName.COMPANY_SEARCH> {
  input: BreadOperationInput<BreezyOperationName.COMPANY_SEARCH>;
  output: BreadOperationOutputWithRawDataAndPayload<
    BreezyOperationName.COMPANY_SEARCH,
    BreezyCompany[],
    Organization[]
  >;
}
