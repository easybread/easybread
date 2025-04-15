import { CommandContext } from '@easybread/core';

import { GoogleCommonOauth2AuthStrategy } from '../google-common.oauth2.auth-strategy';
import { GoogleCommonAccessTokenCreateResponse } from '../interfaces';

export function createContextMock(): CommandContext<GoogleCommonOauth2AuthStrategy> {
  const auth = {
    authenticate: jest.fn().mockResolvedValue({
      access_token: 'access-token',
      expires_in: 3600,
      refresh_token: 'refresh-token',
      scope: 'some-scope some-other-scope',
      token_type: 'Bearer',
    } satisfies GoogleCommonAccessTokenCreateResponse),
    createAuthUri: jest.fn().mockResolvedValue('https://auth-uri'),
  };

  // trick typescript
  const context = { auth } as unknown;
  return context as CommandContext<GoogleCommonOauth2AuthStrategy>;
}
