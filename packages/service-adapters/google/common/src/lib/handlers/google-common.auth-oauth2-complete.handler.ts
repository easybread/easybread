import type { CommandHandler } from '@easybread/core';

import { GoogleCommonAuthOauth2CompleteCommand } from '../commands';
import { GOOGLE_COMMON_COMMAND_NAME } from '../google-common.command-name';
import { GoogleCommonOauth2AuthStrategy } from '../google-common.oauth2.auth-strategy';

export const GoogleCommonAuthOauth2CompleteHandler: CommandHandler<
  GoogleCommonAuthOauth2CompleteCommand,
  GoogleCommonOauth2AuthStrategy
> = {
  name: GOOGLE_COMMON_COMMAND_NAME.AUTH_OAUTH2_COMPLETE,

  async handle(input, context) {
    const data = await context.auth.authenticate(input.breadId, {
      code: input.payload.code,
      state: input.payload.state,
    });

    return {
      success: true,
      breadId: input.breadId,
      payload: {
        '@context': 'https://schema.easybread.io/auth',
        '@type': 'CompleteOAuth2Response',
        credential: {
          '@context': 'https://schema.easybread.io/auth',
          '@type': 'CredentialOAuth2',
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          tokenType: 'Bearer',
          scope: [data.scope.split(' ')].flat(),
          expiresIn: data.expires_in,
        },
      },
      rawPayload: data,
    };
  },
};
