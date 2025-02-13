import type {
  BreadOperationInputWithPayload,
  BreadOperationOutputWithRawData,
  BreadStandardOperation,
} from '@easybread/core';

import type { BambooHrOperationName } from '../bamboo-hr.operation-name';

import type { BambooHrOidcAuthStartOperationInputPayload } from './bamboo-hr.oidc-auth-start.operation.input-payload';
import type { BambooHrOidcAuthStartOperationOutputRawData } from './bamboo-hr.oidc-auth-start.operation.output-raw-data';

export interface BambooHrOidcAuthStartOperation
  extends BreadStandardOperation<BambooHrOperationName.OIDC_AUTH_START> {
  input: BreadOperationInputWithPayload<
    BambooHrOperationName.OIDC_AUTH_START,
    BambooHrOidcAuthStartOperationInputPayload
  >;

  output: BreadOperationOutputWithRawData<
    BambooHrOperationName.OIDC_AUTH_START,
    BambooHrOidcAuthStartOperationOutputRawData
  >;
}
