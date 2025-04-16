import { GoogleCommonAuthOauth2CompleteHandler } from '../handlers';

import { createContextMock } from './create-context-mock';

describe('name', () => {
  it(`should be BREAD/AUTH_OAUTH2_COMPLETE`, () => {
    expect(GoogleCommonAuthOauth2CompleteHandler.name).toEqual(
      'BREAD/AUTH_OAUTH2_COMPLETE',
    );
  });
});

describe('handle', () => {
  it(`should call context.auth.authenticate`, async () => {
    const context = createContextMock();
    await GoogleCommonAuthOauth2CompleteHandler.handle(
      {
        payload: {
          '@context': 'https://schema.easybread.io/auth',
          '@type': 'CompleteOAuth2Request',
          code: '123',
          state: 'some-state',
        },
        params: null,
        breadId: '1',
      },
      context,
      null,
    );

    expect(context.auth.authenticate as jest.Mock).toHaveBeenCalledWith('1', {
      code: '123',
      state: 'some-state',
    });
  });

  it(`should produce correct output with auth data in raw payload`, async () => {
    const context = createContextMock();

    const output = await GoogleCommonAuthOauth2CompleteHandler.handle(
      {
        params: null,
        payload: {
          '@context': 'https://schema.easybread.io/auth',
          '@type': 'CompleteOAuth2Request',
          code: '123',
          state: 'some-state',
        },
        breadId: '1',
      },
      context,
      null,
    );

    expect(output).toEqual({
      breadId: '1',
      payload: {
        '@context': 'https://schema.easybread.io/auth',
        '@type': 'CompleteOAuth2Response',
        credential: {
          '@context': 'https://schema.easybread.io/auth',
          '@type': 'CredentialOAuth2',
          accessToken: 'access-token',
          expiresIn: 3600,
          refreshToken: 'refresh-token',
          scope: ['some-scope', 'some-other-scope'],
          tokenType: 'Bearer',
        },
      },
      rawPayload: {
        access_token: 'access-token',
        expires_in: 3600,
        refresh_token: 'refresh-token',
        scope: 'some-scope some-other-scope',
        token_type: 'Bearer',
      },
      success: true,
    });
  });
});
