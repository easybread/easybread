import type { CommandStandard } from '@easybread/core';
import type {
  AuthCompleteOauth2RequestSchema,
  AuthCompleteOauth2ResponseSchema,
} from '@easybread/schemas';

import { GOOGLE_COMMON_COMMAND_NAME } from '../google-common.command-name';
import type { GoogleCommonAccessTokenCreateResponse } from '../interfaces';

export type GoogleCommonAuthOauth2CompleteCommand = CommandStandard<
  typeof GOOGLE_COMMON_COMMAND_NAME.AUTH_OAUTH2_COMPLETE,
  null,
  AuthCompleteOauth2RequestSchema,
  AuthCompleteOauth2ResponseSchema,
  GoogleCommonAccessTokenCreateResponse
>;

/*

export interface GoogleCommonAuthOauth2CompleteCommand
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
*/
