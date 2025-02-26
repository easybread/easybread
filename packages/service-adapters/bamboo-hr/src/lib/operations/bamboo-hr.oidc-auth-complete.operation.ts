import type {
  BreadOperationInputWithPayload,
  BreadOperationOutputWithRawData,
  BreadStandardOperation,
} from '@easybread/core';

import type { BambooHrOperationName } from '../bamboo-hr.operation-name';

import type { BambooHrOidcAuthCompleteOperationInputPayload } from './bamboo-hr.oidc-auth-complete.operation.input-payload';
import type { BambooHrOidcAuthCompleteOperationOutputRawData } from './bamboo-hr.oidc-auth-complete.operation.output-raw-data';

export interface BambooHrOidcAuthCompleteOperation
  extends BreadStandardOperation<BambooHrOperationName.OIDC_AUTH_COMPLETE> {
  input: BreadOperationInputWithPayload<
    BambooHrOperationName.OIDC_AUTH_COMPLETE,
    BambooHrOidcAuthCompleteOperationInputPayload
  >;

  output: BreadOperationOutputWithRawData<
    BambooHrOperationName.OIDC_AUTH_COMPLETE,
    BambooHrOidcAuthCompleteOperationOutputRawData
  >;
}
