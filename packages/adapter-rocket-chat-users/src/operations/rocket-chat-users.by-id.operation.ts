import {
  BreadOperationInputWithParams,
  BreadOperationOutputWithRawDataAndPayload,
  BreadStandardOperation
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { RocketChatUsersInfo } from '../interfaces';
import { RocketChatUsersOperationName } from '../rocket-chat-users.operation-name';
import { RocketChatUsersByIdOperationInputParams } from './rocket-chat-users.by-id.operation.input-params';

export interface RocketChatUsersByIdOperation
  extends BreadStandardOperation<RocketChatUsersOperationName.BY_ID> {
  input: BreadOperationInputWithParams<
    RocketChatUsersOperationName.BY_ID,
    RocketChatUsersByIdOperationInputParams
  >;

  output: BreadOperationOutputWithRawDataAndPayload<
    RocketChatUsersOperationName.BY_ID,
    RocketChatUsersInfo,
    PersonSchema
  >;
}
