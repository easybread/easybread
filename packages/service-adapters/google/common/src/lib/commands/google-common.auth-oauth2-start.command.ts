import type { CommandStandard } from '@easybread/core';
import type {
  AuthStartOauth2RequestSchema,
  AuthStartOauth2ResponseSchema,
} from '@easybread/schemas';

import { GOOGLE_COMMON_COMMAND_NAME } from '../google-common.command-name';

export type GoogleCommonAuthOauth2StartCommand<
  TScopes extends string = string,
> = CommandStandard<
  typeof GOOGLE_COMMON_COMMAND_NAME.AUTH_OAUTH2_START,
  null,
  AuthStartOauth2RequestSchema<TScopes>,
  AuthStartOauth2ResponseSchema,
  null
>;

//
// export interface GoogleCommonAuthOauth2StartCommand<
//   TScopes extends string = string,
// > extends BreadStandardOperation<GoogleCommonOperationName.AUTH_FLOW_START> {
//   input: BreadOperationInputWithPayload<
//     GoogleCommonOperationName.AUTH_FLOW_START,
//     GoogleCommonOauth2StartOperationInputPayload<TScopes>
//   >;
//   output: BreadOperationOutputWithRawData<
//     GoogleCommonOperationName.AUTH_FLOW_START,
//     GoogleCommonOauth2StartOperationOutputRawData
//   >;
// }
