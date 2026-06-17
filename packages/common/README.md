# @easybread/common

Low-level TypeScript helpers shared across the EasyBREAD codebase.

## Install

```shell
pnpm add @easybread/common
```

## What's inside

Small, dependency-free type and enum utilities used to compose operation catalogs and
adapter types, including:

- **`enumPickKeys`** — derive a new enum from a subset of an existing enum's keys
  (used by adapters to declare the operations they support).
- **`enumMerge`** — merge several enums into one (used to combine shared auth commands
  with provider-specific commands).
- **`enumPrefixed`** — build a namespaced enum from a list of names.

These power the `*_COMMAND_NAME` definitions in every service adapter.

## Development

Run `nx test common` to execute the unit tests and `nx build common` to build.
