import {
  RocketChatAuthStrategy,
  RocketChatServiceAdapterOptions,
  rocketChatUserAdapter,
} from '@easybread/adapter-rocket-chat-common';
import { type CommandHandler } from '@easybread/core';

import { RocketChatUsersByIdCommand } from '../commands';
import { RocketChatUsersInfo } from '../interfaces';
import { ROCKET_CHAT_USERS_COMMAND_NAME } from '../rocket-chat-users.command-name';

export const RocketChatUsersByIdHandler: CommandHandler<
  RocketChatUsersByIdCommand,
  RocketChatAuthStrategy,
  RocketChatServiceAdapterOptions
> = {
  name: ROCKET_CHAT_USERS_COMMAND_NAME.BASIC_USER_BY_ID,
  async handle(input, context, options) {
    const { params } = input;
    const { serverUrl } = options;

    const result = await context.httpRequest<RocketChatUsersInfo>({
      method: 'GET',
      url: new URL('/api/v1/users.info', serverUrl).href,
      params: rocketChatUserAdapter.toExternal(params),
    });

    if (!result.data.success) {
      throw new Error(JSON.stringify(result.data));
    }

    return {
      success: true,
      breadId: input.breadId,
      payload: rocketChatUserAdapter.toInternal(result.data.user),
      rawPayload: result.data,
    };
  },
};
