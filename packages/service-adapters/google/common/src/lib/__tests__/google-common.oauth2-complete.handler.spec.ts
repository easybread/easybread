import { GoogleCommonOauth2CompleteHandler } from '../handlers';
import type { GoogleCommonAccessTokenCreateResponse } from '../interfaces';
import { GoogleCommonOperationName } from '../operations';

import { createContextMock } from './create-context-mock';

describe('name', () => {
  it(`should be GOOGLE_COMMON/AUTH_FLOW/COMPLETE`, () => {
    expect(GoogleCommonOauth2CompleteHandler.name).toEqual(
      'GOOGLE_COMMON/AUTH_FLOW/COMPLETE',
    );
  });
});

describe('handle', () => {
  it(`should call context.auth.authenticate`, async () => {
    const context = createContextMock();
    await GoogleCommonOauth2CompleteHandler.handle(
      {
        payload: { code: '123', state: 'some-state' },
        name: GoogleCommonOperationName.AUTH_FLOW_COMPLETE,
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

    jest.mocked(context.auth.authenticate).mockImplementationOnce(async () => {
      return {
        access_token: 'access-token',
        expires_in: 3600,
        refresh_token: 'refresh-token',
        scope: 'some-scope',
        token_type: 'Bearer',
      } satisfies GoogleCommonAccessTokenCreateResponse;
    });

    const output = await GoogleCommonOauth2CompleteHandler.handle(
      {
        payload: { code: '123', state: 'some-state' },
        name: GoogleCommonOperationName.AUTH_FLOW_COMPLETE,
        breadId: '1',
      },
      context,
      null,
    );

    expect(output).toEqual({
      name: 'GOOGLE_COMMON/AUTH_FLOW/COMPLETE',
      rawPayload: {
        // auth data returned from the auth strategy
        data: {
          access_token: 'access-token',
          expires_in: 3600,
          refresh_token: 'refresh-token',
          scope: 'some-scope',
          token_type: 'Bearer',
        },
        success: true,
      },
    });
  });
});
