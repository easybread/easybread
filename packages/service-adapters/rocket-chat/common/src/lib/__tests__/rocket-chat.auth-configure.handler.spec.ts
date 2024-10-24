import { BreadOperationContext } from '@easybread/core';
import { createContextMock } from '@easybread/test-utils';

import {
  RocketChatAuthConfigureHandler,
  RocketChatAuthStrategy,
  RocketChatOperationName,
} from '../..';

afterAll(() => {
  jest.restoreAllMocks();
});

it(`should call RocketChatAuthStrategy.authenticate with token and user id`, async () => {
  const context =
    createContextMock<BreadOperationContext<RocketChatAuthStrategy>>();

  await RocketChatAuthConfigureHandler.handle(
    {
      name: RocketChatOperationName.AUTH_CONFIGURE,
      params: { userId: 'user id', authToken: 'token' },
      breadId: '1',
    },
    context,
    { serverUrl: 'doesnt-matter' }
  );

  expect(jest.mocked(context.auth.authenticate).mock.calls).toEqual([
    ['1', { authToken: 'token', userId: 'user id' }],
  ]);
});
