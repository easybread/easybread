import type { CommandHandler } from '@easybread/core';

import { GoogleCommonAuthOauth2StartCommand } from '../commands';
import { GOOGLE_COMMON_COMMAND_NAME } from '../google-common.command-name';
import { GoogleCommonOauth2AuthStrategy } from '../google-common.oauth2.auth-strategy';

export const GoogleCommonAuthOauth2StartHandler: CommandHandler<
  GoogleCommonAuthOauth2StartCommand,
  GoogleCommonOauth2AuthStrategy
> = {
  name: GOOGLE_COMMON_COMMAND_NAME.AUTH_OAUTH2_START,

  async handle(input, context) {
    const authUri = await context.auth.createAuthUri(input.breadId, {
      scope: input.payload.scope,
      loginHint: input.payload.loginHint,
      prompt: input.payload.prompt,
    });

    return {
      success: true,
      breadId: input.breadId,
      payload: {
        '@context': 'https://schema.easybread.io/auth',
        '@type': 'StartOAuth2Response',
        authenticationUrl: authUri,
      },
      rawPayload: null,
    };
  },
};
