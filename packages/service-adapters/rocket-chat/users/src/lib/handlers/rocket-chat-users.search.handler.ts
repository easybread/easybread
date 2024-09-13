import {
  BreadOperationHandler,
  createSuccessfulCollectionOutputWithRawDataAndPayload,
} from '@easybread/core';
import {
  RocketChatAuthStrategy,
  rocketChatPaginationAdapter,
  RocketChatServiceAdapterOptions,
  rocketChatUserAdapter,
} from '@easybread/adapter-rocket-chat-common';
import { resolve } from 'url';

import { RocketChatUsersList } from '../interfaces';
import { RocketChatUsersSearchOperation } from '../operations';
import { RocketChatUsersOperationName } from '../rocket-chat-users.operation-name';

export const RocketChatUsersSearchHandler: BreadOperationHandler<
  RocketChatUsersSearchOperation,
  RocketChatAuthStrategy,
  RocketChatServiceAdapterOptions
> = {
  name: RocketChatUsersOperationName.SEARCH,
  async handle(input, context, options) {
    const { name, pagination } = input;
    const { serverUrl } = options;

    const result = await context.httpRequest<RocketChatUsersList>({
      method: 'GET',
      url: resolve(serverUrl, '/api/v1/users.list'),
      params: rocketChatPaginationAdapter.toExternalParams(pagination),
    });

    if (!result.data.success) throw new Error(JSON.stringify(result.data));

    return createSuccessfulCollectionOutputWithRawDataAndPayload(
      name,
      result.data,
      result.data.users.map((user) => rocketChatUserAdapter.toInternal(user)),
      rocketChatPaginationAdapter.toInternalData(result.data)
    );
  },
};
