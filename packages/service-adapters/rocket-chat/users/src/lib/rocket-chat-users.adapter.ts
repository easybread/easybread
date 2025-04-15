import {
  RocketChatAuthBasicSetHandler,
  RocketChatAuthStrategy,
  RocketChatServiceAdapterOptions,
} from '@easybread/adapter-rocket-chat-common';
import { ServiceAdapter } from '@easybread/core';

import {
  RocketChatUsersByIdHandler,
  RocketChatUsersSearchHandler,
} from './handlers';
import { ROCKET_CHAT_USERS_PROVIDER_NAME } from './rocket-chat-users.constants';

const HANDLER_MAP = {
  [RocketChatUsersSearchHandler.name]: RocketChatUsersSearchHandler,
  [RocketChatUsersByIdHandler.name]: RocketChatUsersByIdHandler,
  [RocketChatAuthBasicSetHandler.name]: RocketChatAuthBasicSetHandler,
} as const;

export class RocketChatUsersAdapter extends ServiceAdapter<
  typeof HANDLER_MAP,
  RocketChatAuthStrategy,
  RocketChatServiceAdapterOptions
> {
  provider = ROCKET_CHAT_USERS_PROVIDER_NAME;

  constructor(
    auth: RocketChatAuthStrategy,
    options: RocketChatServiceAdapterOptions,
  ) {
    super(HANDLER_MAP, auth, options);
  }
}
