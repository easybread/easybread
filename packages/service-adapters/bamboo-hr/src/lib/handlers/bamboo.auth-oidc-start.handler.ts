import {
  type CommandHandler,
  ValidationFailedException,
} from '@easybread/core';

import type { BambooHrAuthStrategy } from '../bamboo-hr.auth-strategy';
import { BAMBOO_HR_COMMAND_NAME } from '../bamboo-hr.command-name';
import type { BambooAuthOidcStartCommand } from '../commands';

export const BambooAuthOidcStartHandler: CommandHandler<
  BambooAuthOidcStartCommand,
  BambooHrAuthStrategy
> = {
  name: BAMBOO_HR_COMMAND_NAME.AUTH_OIDC_START,

  async handle(input, context) {
    const { breadId, params } = input;

    if (!params.name) {
      throw new ValidationFailedException(['params.name is required']);
    }

    const authUri = await context.auth.createOidcAuthUri(breadId, {
      companyName: params.name,
    });

    return {
      success: true,
      breadId: input.breadId,
      payload: {
        '@context': 'https://schema.easybread.io/auth',
        '@type': 'StartOAuth2Response',
        authenticationUrl: authUri,
      },
      rawPayload: { authUri },
    };
  },
};
