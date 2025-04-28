import { resolve } from 'url';

import {
  RocketChatAuthStrategy,
  RocketChatServiceAdapterOptions,
  rocketChatPaginationAdapter,
  rocketChatUserAdapter,
} from '@easybread/adapter-rocket-chat-common';
import { type CommandHandler } from '@easybread/core';

import { RocketChatUsersSearchCommand } from '../commands';
import { RocketChatUsersList } from '../interfaces';
import { ROCKET_CHAT_USERS_COMMAND_NAME } from '../rocket-chat-users.command-name';

export const RocketChatUsersSearchHandler: CommandHandler<
  RocketChatUsersSearchCommand,
  RocketChatAuthStrategy,
  RocketChatServiceAdapterOptions
> = {
  name: ROCKET_CHAT_USERS_COMMAND_NAME.BASIC_USER_SEARCH,
  async handle(input, context, options) {
    const { pagination } = input;
    const { serverUrl } = options;

    const result = await context.httpRequest<RocketChatUsersList>({
      method: 'GET',
      url: resolve(serverUrl, '/api/v1/users.list'),
      params: rocketChatPaginationAdapter.toExternalParams(pagination),
    });

    if (!result.data.success) throw new Error(JSON.stringify(result.data));

    return {
      success: true,
      breadId: input.breadId,
      payload: result.data.users.map(rocketChatUserAdapter.toInternal),
      pagination: rocketChatPaginationAdapter.toInternalData(result.data),
      rawPayload: result.data,
    };
  },
};
