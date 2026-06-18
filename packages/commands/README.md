# @easybread/commands

The canonical catalog of EasyBREAD operations.

## Install

```shell
pnpm add @easybread/commands
```

## What's inside

- **`BREAD_COMMAND_NAME`** — the enum of every operation name understood by the
  framework, grouped into:
  - **Basic** user BREAD operations (`BASIC_USER_SEARCH`, `BASIC_USER_BY_ID`,
    `BASIC_USER_CREATE`, `BASIC_USER_UPDATE`, `BASIC_USER_DELETE`)
  - **Auth** operations (OAuth 2.0, OpenID Connect and Basic auth)
  - **HR** operations (employee BREAD, job application / applicant search)
- The shared **command and command-output types** that adapters specialize.

Each service adapter exposes the subset of these commands it supports (for example
via `BAMBOO_HR_COMMAND_NAME`), built with the helpers from
[`@easybread/common`](../common).

## Development

Run `nx test commands` to execute the unit tests and `nx build commands` to build.
