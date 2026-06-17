# @easybread/adapter-google-common

Shared Google **OAuth 2.0** authentication used by the EasyBREAD Google adapters
(such as [`@easybread/adapter-google-admin-directory`](../admin-directory) and
[`@easybread/adapter-google-contacts`](../contacts)).

## Install

```shell
pnpm add @easybread/adapter-google-common
```

## What's inside

- The shared Google OAuth 2.0 auth flow and strategy base.
- `GoogleCommonOperationName` / `GOOGLE_COMMON_COMMAND_NAME` with the
  `AUTH_OAUTH2_START` and `AUTH_OAUTH2_COMPLETE` operations that the concrete Google
  adapters reuse.

You typically don't depend on this package directly for data operations — you install
it alongside a concrete Google adapter, which re-exports the auth flow.

## Development

Run `nx test service-adapters-google-common` and `nx build service-adapters-google-common`.
