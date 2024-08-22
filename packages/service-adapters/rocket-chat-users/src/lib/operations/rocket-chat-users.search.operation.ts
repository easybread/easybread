import {
  BreadCollectionOperation,
  BreadCollectionOperationInputWithParams,
  BreadCollectionOperationOutputWithRawDataAndPayload
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { RocketChatUsersList } from '../interfaces';
import { RocketChatUsersOperationName } from '../rocket-chat-users.operation-name';
import { RocketChatUsersSearchOperationInputParams } from './rocket-chat-users.search.operation.input-params';

export interface RocketChatUsersSearchOperation
  extends BreadCollectionOperation<
    RocketChatUsersOperationName.SEARCH,
    'SKIP_COUNT'
  > {
  input: BreadCollectionOperationInputWithParams<
    RocketChatUsersOperationName.SEARCH,
    RocketChatUsersSearchOperationInputParams,
    'SKIP_COUNT'
  >;

  output: BreadCollectionOperationOutputWithRawDataAndPayload<
    RocketChatUsersOperationName.SEARCH,
    RocketChatUsersList,
    PersonSchema[],
    'SKIP_COUNT'
  >;
}
