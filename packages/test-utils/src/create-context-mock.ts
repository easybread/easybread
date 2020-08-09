export function createContextMock<
  TBreadOperationContext
>(): TBreadOperationContext {
  const auth = {
    authenticate: jest.fn(),
    createAuthUri: jest.fn()
  };

  // trick typescript
  const context = { auth } as any;
  return context as TBreadOperationContext;
}
