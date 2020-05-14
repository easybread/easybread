import {
  BreadOperation,
  BreadOperationInputWithPayload,
  BreadOperationOutputWithRawData
} from '@easybread/core';

import { GoogleCommonOauth2StartOperationInputPayload } from './google-common.oauth2-start.operation.input-payload';
import { GoogleCommonOauth2StartOperationOutputRawData } from './google-common.oauth2-start.operation.output-raw-data';
import { GoogleCommonOperationName } from './google-common.operation-name';

export interface GoogleCommonOauth2StartOperation<
  TScopes extends string = string
> extends BreadOperation<GoogleCommonOperationName.AUTH_FLOW_START> {
  input: BreadOperationInputWithPayload<
    GoogleCommonOperationName.AUTH_FLOW_START,
    GoogleCommonOauth2StartOperationInputPayload<TScopes>
  >;
  output: BreadOperationOutputWithRawData<
    GoogleCommonOperationName.AUTH_FLOW_START,
    GoogleCommonOauth2StartOperationOutputRawData
  >;
}
