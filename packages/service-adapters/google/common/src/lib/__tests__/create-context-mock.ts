import { BreadOperationContext } from '@easybread/core';

import { GoogleCommonOauth2AuthStrategy } from '../google-common.oauth2.auth-strategy';

export function createContextMock(): BreadOperationContext<GoogleCommonOauth2AuthStrategy> {
  const auth = {
    authenticate: jest.fn(),
    createAuthUri: jest.fn(),
  };

  // trick typescript
  const context = { auth } as unknown;
  return context as BreadOperationContext<GoogleCommonOauth2AuthStrategy>;
}
