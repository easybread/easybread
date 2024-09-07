import {
  BreadOperationInputWithParams,
  BreadOperationOutput,
  BreadStandardOperation,
} from '@easybread/core';

import { RocketChatOperationName } from '../rocket-chat.operation-name';
import { RocketChatAuthConfigureOperationInputParams } from './rocket-chat.auth-configure-operation.input-params';

export interface RocketChatAuthConfigureOperation
  extends BreadStandardOperation<RocketChatOperationName.AUTH_CONFIGURE> {
  input: BreadOperationInputWithParams<
    RocketChatOperationName.AUTH_CONFIGURE,
    RocketChatAuthConfigureOperationInputParams
  >;
  output: BreadOperationOutput<RocketChatOperationName.AUTH_CONFIGURE>;
}
