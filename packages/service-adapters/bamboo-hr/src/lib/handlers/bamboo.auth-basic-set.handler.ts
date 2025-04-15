import { type CommandHandler } from '@easybread/core';

import { BambooHrAuthStrategy } from '../bamboo-hr.auth-strategy';
import { BAMBOO_HR_COMMAND_NAME } from '../bamboo-hr.command-name';
import type { BambooAuthBasicSetCommand } from '../commands';

export const BambooAuthBasicSetHandler: CommandHandler<
  BambooAuthBasicSetCommand,
  BambooHrAuthStrategy
> = {
  name: BAMBOO_HR_COMMAND_NAME.AUTH_BASIC_SET,

  async handle(input, context) {
    await context.auth.authenticate(input.breadId, {
      apiKey: input.payload.password,
      companyName: input.payload.username,
    });

    return {
      breadId: input.breadId,
      success: true,
      payload: null,
      rawPayload: null,
    };
  },
};
