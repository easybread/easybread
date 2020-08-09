import { BreadOperationHandler, createSuccessfulOutput } from '@easybread/core';

import { RocketChatAuthConfigureOperation } from '../operations';
import { RocketChatAuthStrategy } from '../rocket-chat.auth-strategy';
import { RocketChatOperationName } from '../rocket-chat.operation-name';

export const RocketChatAuthConfigureHandler: BreadOperationHandler<
  RocketChatAuthConfigureOperation,
  RocketChatAuthStrategy
> = {
  name: RocketChatOperationName.AUTH_CONFIGURE,
  async handle(input, context) {
    const { name, params, breadId } = input;

    await context.auth.authenticate(breadId, params);

    return createSuccessfulOutput(name);
  }
};
