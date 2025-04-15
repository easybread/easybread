import { type CommandHandler } from '@easybread/core';

import { RocketChatAuthBasicSetCommand } from '../commands';
import { RocketChatAuthStrategy } from '../rocket-chat.auth-strategy';
import { ROCKET_CHAT_COMMAND_NAME } from '../rocket-chat.command-name';
import { RocketChatServiceAdapterOptions } from '../rocket-chat.service-adapter.options';

export const RocketChatAuthBasicSetHandler: CommandHandler<
  RocketChatAuthBasicSetCommand,
  RocketChatAuthStrategy,
  RocketChatServiceAdapterOptions
> = {
  name: ROCKET_CHAT_COMMAND_NAME.AUTH_BASIC_SET,
  async handle(input, context) {
    const { payload, breadId } = input;

    await context.auth.authenticate(breadId, {
      authToken: payload.password,
      userId: payload.username,
    });

    return {
      success: true,
      breadId,
      payload: null,
      rawPayload: null,
    };
  },
};
