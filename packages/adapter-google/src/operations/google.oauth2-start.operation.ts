import {
  BreadOperation,
  BreadOperationInputWithPayload,
  BreadOperationOutputWithRawData
} from '@easybread/core';

import { GoogleOperationName } from '../google.operation-name';
import {
  GoogleOauth2StartInputPayload,
  GoogleOauth2StartOutputRawPayloadData
} from '../interfaces';

export interface GoogleOauth2StartOperation
  extends BreadOperation<GoogleOperationName.AUTH_FLOW_START> {
  input: BreadOperationInputWithPayload<
    GoogleOperationName.AUTH_FLOW_START,
    GoogleOauth2StartInputPayload
  >;
  output: BreadOperationOutputWithRawData<
    GoogleOperationName.AUTH_FLOW_START,
    GoogleOauth2StartOutputRawPayloadData
  >;
}
