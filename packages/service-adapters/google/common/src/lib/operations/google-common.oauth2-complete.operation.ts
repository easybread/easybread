import {
  BreadOperationInputWithPayload,
  BreadOperationOutputWithRawData,
  BreadStandardOperation,
} from '@easybread/core';

import { GoogleCommonAccessTokenCreateResponse } from '../interfaces';
import { GoogleCommonOauth2CompleteOperationInputPayload } from './google-common.oauth2-complete.operation.input-payload';
import { GoogleCommonOperationName } from './google-common.operation-name';

export interface GoogleCommonOauth2CompleteOperation
  extends BreadStandardOperation<GoogleCommonOperationName.AUTH_FLOW_COMPLETE> {
  input: BreadOperationInputWithPayload<
    GoogleCommonOperationName.AUTH_FLOW_COMPLETE,
    GoogleCommonOauth2CompleteOperationInputPayload
  >;
  output: BreadOperationOutputWithRawData<
    GoogleCommonOperationName.AUTH_FLOW_COMPLETE,
    GoogleCommonAccessTokenCreateResponse
  >;
}
