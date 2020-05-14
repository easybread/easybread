import { BreadOperationContext } from '@easybread/core';

import { GoogleCommonOauth2AuthStrategy } from '../google-common.oauth2.auth-strategy';
import { GoogleCommonOauth2CompleteOperation } from '../operations';

export function createContextMock(): BreadOperationContext<
  GoogleCommonOauth2CompleteOperation,
  GoogleCommonOauth2AuthStrategy
> {
  const auth = {
    authenticate: jest.fn(),
    createAuthUri: jest.fn()
  };

  // trick typescript
  const context = { auth } as any;
  return context as BreadOperationContext<
    GoogleCommonOauth2CompleteOperation,
    GoogleCommonOauth2AuthStrategy
  >;
}
