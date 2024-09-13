import { GoogleCommonOauth2StartHandler } from '../handlers';
import {
  GoogleCommonOauth2StartOperation,
  GoogleCommonOperationName,
} from '../operations';
import { createContextMock } from './create-context-mock';

describe('name', () => {
  it(`should be`, () => {
    expect(GoogleCommonOauth2StartHandler.name).toBe(
      'GOOGLE_COMMON/AUTH_FLOW/START'
    );
  });
});

describe('handle()', () => {
  it(`should call context.auth.createAuthUri()`, () => {
    const context = createContextMock<GoogleCommonOauth2StartOperation>();
    GoogleCommonOauth2StartHandler.handle(
      {
        name: GoogleCommonOperationName.AUTH_FLOW_START,
        breadId: '1',
        payload: {
          includeGrantedScopes: true,
          loginHint: 'hint',
          prompt: ['select_account', 'consent'],
          scope: ['test-scope'],
          state: 'teststate=testval',
        },
      },
      context,
      null
    );
    expect(context.auth.createAuthUri).toHaveBeenCalledWith('1', {
      includeGrantedScopes: true,
      loginHint: 'hint',
      prompt: ['select_account', 'consent'],
      scope: ['test-scope'],
      state: 'teststate=testval',
    });
  });

  it(`should produce correct output with authUrl in raw payload `, async () => {
    const context = createContextMock<GoogleCommonOauth2StartOperation>();

    (context.auth.createAuthUri as jest.Mock).mockImplementationOnce(
      () => 'http://authurl'
    );

    const output = await GoogleCommonOauth2StartHandler.handle(
      {
        name: GoogleCommonOperationName.AUTH_FLOW_START,
        breadId: '1',
        payload: {
          includeGrantedScopes: true,
          loginHint: 'hint',
          prompt: ['select_account', 'consent'],
          scope: ['test-scope'],
          state: 'teststate=testval',
        },
      },
      context,
      null
    );

    expect(output).toEqual({
      name: 'GOOGLE_COMMON/AUTH_FLOW/START',
      rawPayload: {
        data: { authUri: 'http://authurl' },
        success: true,
      },
    });
  });
});
