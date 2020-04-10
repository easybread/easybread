import {
  BreadOperation,
  BreadOperationInputWithPayload,
  BreadOperationOutputWithRawData
} from '@easybread/core';

import { GoogleOperationName } from '../google.operation-name';
import {
  GoogleAccessTokenCreateResponse,
  GoogleOauth2CompleteInputPayload
} from '../interfaces';

export interface GoogleOauth2CompleteOperation
  extends BreadOperation<GoogleOperationName.AUTH_FLOW_COMPLETE> {
  input: BreadOperationInputWithPayload<
    GoogleOperationName.AUTH_FLOW_COMPLETE,
    GoogleOauth2CompleteInputPayload
  >;
  output: BreadOperationOutputWithRawData<
    GoogleOperationName.AUTH_FLOW_COMPLETE,
    GoogleAccessTokenCreateResponse
  >;
}
