import { GoogleCommonAuthOauth2StartHandler } from '../handlers';

import { createContextMock } from './create-context-mock';

describe('name', () => {
  it(`should be "BREAD/AUTH_OAUTH2_START"`, () => {
    expect(GoogleCommonAuthOauth2StartHandler.name).toBe(
      'BREAD/AUTH_OAUTH2_START',
    );
  });
});

describe('handle()', () => {
  it(`should call context.auth.createAuthUri()`, () => {
    const context = createContextMock();
    GoogleCommonAuthOauth2StartHandler.handle(
      {
        breadId: '1',
        params: null,
        payload: {
          '@context': 'https://schema.easybread.io/auth',
          '@type': 'StartOAuth2Request',
          loginHint: 'hint',
          scope: ['test-scope'],
        },
      },
      context,
      null,
    );
    expect(context.auth.createAuthUri).toHaveBeenCalledWith('1', {
      loginHint: 'hint',
      scope: ['test-scope'],
    });
  });

  it(`should produce correct output with authUrl in raw payload `, async () => {
    const context = createContextMock();

    jest
      .mocked(context.auth.createAuthUri)
      .mockImplementationOnce(async () => 'http://authurl');

    const output = await GoogleCommonAuthOauth2StartHandler.handle(
      {
        breadId: '1',
        params: null,
        payload: {
          '@context': 'https://schema.easybread.io/auth',
          '@type': 'StartOAuth2Request',
          loginHint: 'hint',
          scope: ['test-scope'],
        },
      },
      context,
      null,
    );

    expect(output).toEqual({
      breadId: '1',
      payload: {
        '@context': 'https://schema.easybread.io/auth',
        '@type': 'StartOAuth2Response',
        authenticationUrl: 'http://authurl',
      },
      rawPayload: null,
      success: true,
    });
  });
});
