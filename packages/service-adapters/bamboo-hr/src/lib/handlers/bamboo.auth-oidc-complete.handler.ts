import { type CommandHandler } from '@easybread/core';

import type { BambooHrAuthStrategy } from '../bamboo-hr.auth-strategy';
import { BAMBOO_HR_COMMAND_NAME } from '../bamboo-hr.command-name';
import type { BambooAuthOidcCompleteCommand } from '../commands';

export const BambooAuthOidcCompleteHandler: CommandHandler<
  BambooAuthOidcCompleteCommand,
  BambooHrAuthStrategy
> = {
  name: BAMBOO_HR_COMMAND_NAME.AUTH_OIDC_COMPLETE,

  async handle(input, context) {
    const { code, state } = input.payload;

    const { companyName } = await context.auth.authenticateOidc(input.breadId, {
      code,
      state,
    });

    return {
      success: true,
      breadId: input.breadId,
      payload: null,
      rawPayload: { companyName },
    };
  },
};
