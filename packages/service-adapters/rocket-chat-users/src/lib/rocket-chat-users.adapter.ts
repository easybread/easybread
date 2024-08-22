import { BreadServiceAdapter } from '@easybread/core';
import {
  RocketChatAuthConfigureHandler,
  RocketChatAuthStrategy,
  RocketChatServiceAdapterOptions
} from '@easybread/rocket-chat-common';

import {
  RocketChatUsersByIdHandler,
  RocketChatUsersSearchHandler
} from './handlers';
import { ROCKET_CHAT_USERS_PROVIDER_NAME } from './rocket-chat-users.constants';
import { RocketChatUsersOperation } from './rocket-chat-users.operation';

export class RocketChatUsersAdapter extends BreadServiceAdapter<
  RocketChatUsersOperation,
  RocketChatAuthStrategy,
  RocketChatServiceAdapterOptions
> {
  provider = ROCKET_CHAT_USERS_PROVIDER_NAME;

  constructor(options: RocketChatServiceAdapterOptions) {
    super(options);
    this.registerOperationHandlers(
      RocketChatAuthConfigureHandler,
      RocketChatUsersSearchHandler,
      RocketChatUsersByIdHandler
    );
  }
}
