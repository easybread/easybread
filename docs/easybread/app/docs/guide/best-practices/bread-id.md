---
sidebar_position: 1
sidebar_label: Bread ID Best Practices
---

# Bread ID Best Practices

Bread ID is an identifier that is used to associate state data with an entity in the application.

Read more about the `breadId` on the [Mental Model](../mental-model.md) page.

## Bread ID Utilities

It is a best practice to define reusable functions to encode and decode the breadId (or constants if you don't use dynamic breadIds)

```ts
export const encodeBreadId = (userId: string) => `user:${userId}`;
export const decodeBreadId = (breadId: string) => {
  const [_, userId] = breadId.split(':');
  return { userId };
};
```
Or if you don't use dynamic breadIds:

```ts
export const COMMON_BREAD_ID = 'application:common';
export const SEPCIAL_BREAD_ID = 'application:special';
// etc.
```
