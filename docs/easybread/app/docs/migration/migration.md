# Migration Guide

## From v0.0.10 to v0.0.11

`EasyBreadClient.invoke` method interface changed.

New interface is more concise and provides better IDE auto-completion.

```ts
// <=v0.0.10
await client.invoke<
  FooServiceGetSomethingOperation
>({
  name: FooServiceOperationName.GET_SOMETHING,
  breadId: 'my-bread-id',
  // other fields
});

// v0.0.11
await client.invoke(
  FooServiceOperationName.GET_SOMETHING,
  {
    breadId: 'my-bread-id',
    // other fields
  }
);
```
