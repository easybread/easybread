export function createContextMock<
  TBreadOperationContext
>(): TBreadOperationContext {
  const auth = {
    authenticate: jest.fn(),
    createAuthUri: jest.fn(),
  };

  return { auth } as unknown as TBreadOperationContext;
}
