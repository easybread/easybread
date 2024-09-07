import {
  BreadOperationHandler,
  createSuccessfulOutputWithRawDataAndPayload,
} from '@easybread/core';
import {
  RocketChatAuthStrategy,
  RocketChatServiceAdapterOptions,
  rocketChatUserAdapter,
} from '@easybread/adapter-rocket-chat-common';
import { resolve } from 'url';

import { RocketChatUsersInfo } from '../interfaces';
import { RocketChatUsersByIdOperation } from '../operations';
import { RocketChatUsersOperationName } from '../rocket-chat-users.operation-name';

export const RocketChatUsersByIdHandler: BreadOperationHandler<
  RocketChatUsersByIdOperation,
  RocketChatAuthStrategy,
  RocketChatServiceAdapterOptions
> = {
  name: RocketChatUsersOperationName.BY_ID,
  async handle(input, context, options) {
    const { name, params } = input;
    const { serverUrl } = options;

    const result = await context.httpRequest<RocketChatUsersInfo>({
      method: 'GET',
      url: resolve(serverUrl, '/api/v1/users.info'),
      params: rocketChatUserAdapter.toExternal({
        '@type': 'Person',
        ...params,
      }),
    });

    if (!result.data.success) {
      throw new Error(JSON.stringify(result.data));
    }

    return createSuccessfulOutputWithRawDataAndPayload(
      name,
      result.data,
      rocketChatUserAdapter.toInternal(result.data.user)
    );
  },
};
