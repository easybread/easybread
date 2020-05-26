import { GoogleCommonOauth2CompleteHandler } from '../handlers';
import {
  GoogleCommonOauth2CompleteOperation,
  GoogleCommonOperationName
} from '../operations';
import { createContextMock } from './create-context-mock';

describe('name', () => {
  it(`should be GOOGLE_COMMON/AUTH_FLOW/COMPLETE`, () => {
    expect(GoogleCommonOauth2CompleteHandler.name).toEqual(
      'GOOGLE_COMMON/AUTH_FLOW/COMPLETE'
    );
  });
});

describe('handle', () => {
  it(`should call context.auth.authenticate`, async () => {
    const context = createContextMock<GoogleCommonOauth2CompleteOperation>();
    await GoogleCommonOauth2CompleteHandler.handle(
      {
        payload: { code: '123' },
        name: GoogleCommonOperationName.AUTH_FLOW_COMPLETE,
        breadId: '1'
      },
      context
    );

    expect(context.auth.authenticate as jest.Mock).toHaveBeenCalledWith('1', {
      code: '123'
    });
  });

  it(`should produce correct output with auth data in raw payload`, async () => {
    const context = createContextMock<GoogleCommonOauth2CompleteOperation>();

    (context.auth.authenticate as jest.Mock).mockImplementationOnce(() => {
      return { foo: 'bar' };
    });
    const output = await GoogleCommonOauth2CompleteHandler.handle(
      {
        payload: { code: '123' },
        name: GoogleCommonOperationName.AUTH_FLOW_COMPLETE,
        breadId: '1'
      },
      context
    );

    expect(output).toEqual({
      name: 'GOOGLE_COMMON/AUTH_FLOW/COMPLETE',
      rawPayload: {
        // auth data returned from the auth strategy
        data: { foo: 'bar' },
        success: true
      }
    });
  });
});
