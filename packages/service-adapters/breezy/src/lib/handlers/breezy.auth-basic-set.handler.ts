import { type CommandHandler } from '@easybread/core';

import { BreezyAuthStrategy } from '../breezy.auth-strategy';
import { BREEZY_COMMAND_NAME } from '../breezy.command-name';
import type { BreezyAuthBasicSetCommand } from '../commands/breezy.auth-basic-set.command';
import { breezyUserAdapter } from '../data-adapters';

export const BreezyAuthBasicSetHandler: CommandHandler<
  BreezyAuthBasicSetCommand,
  BreezyAuthStrategy
> = {
  name: BREEZY_COMMAND_NAME.AUTH_BASIC_SET,

  async handle(input, context) {
    const { breadId, payload } = input;

    const result = await context.auth.authenticate(breadId, {
      email: payload.username,
      password: payload.password,
    });

    return {
      success: true,
      breadId,
      payload: breezyUserAdapter.toInternal(result.user),
      rawPayload: result,
    };
  },
};
