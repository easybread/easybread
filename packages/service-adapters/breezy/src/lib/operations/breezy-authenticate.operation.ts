import {
  BreadOperationInputWithPayload,
  BreadOperationOutputWithRawData,
  BreadStandardOperation
} from '@easybread/core';

import { BreezyOperationName } from '../breezy.operation-name';
import {
  BreezyAuthenticatePayload,
  BreezyAuthenticateResponse
} from '../interfaces';

export interface BreezyAuthenticateOperation
  extends BreadStandardOperation<BreezyOperationName.AUTHENTICATE> {
  input: BreadOperationInputWithPayload<
    BreezyOperationName.AUTHENTICATE,
    BreezyAuthenticatePayload
  >;
  output: BreadOperationOutputWithRawData<
    BreezyOperationName.AUTHENTICATE,
    BreezyAuthenticateResponse
  >;
}
