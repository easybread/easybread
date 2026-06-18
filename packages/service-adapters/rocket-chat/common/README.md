# @easybread/adapter-rocket-chat-common

Shared [Rocket.Chat](https://www.rocket.chat/) **Basic auth** used by the EasyBREAD
Rocket.Chat adapters (such as [`@easybread/adapter-rocket-chat-users`](../users)).

## Install

```shell
pnpm add @easybread/adapter-rocket-chat-common
```

## What's inside

- The shared Rocket.Chat auth strategy and base adapter.
- `ROCKET_CHAT_COMMAND_NAME` with the `AUTH_BASIC_SET` operation that the concrete
  Rocket.Chat adapters reuse.

You typically install this alongside a concrete Rocket.Chat adapter rather than using
it directly for data operations.

## Development

Run `nx test service-adapters-rocket-chat-common` and
`nx build service-adapters-rocket-chat-common`.
