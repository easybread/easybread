# @easybread/adapter-breezy

[EasyBREAD](../../../README.md) service adapter for
[Breezy HR](https://breezy.hr/).

## Install

```shell
pnpm add @easybread/adapter-breezy
```

## Authentication

Uses **Basic auth**. Set the credentials with the `AUTH_BASIC_SET` operation before
invoking other operations.

```ts
import { EasyBreadClient, InMemoryStateAdapter } from '@easybread/core';
import { BreezyAdapter, BreezyAuthStrategy } from '@easybread/adapter-breezy';

const stateAdapter = new InMemoryStateAdapter();
const authStrategy = new BreezyAuthStrategy(stateAdapter);
const client = new EasyBreadClient(stateAdapter, new BreezyAdapter(authStrategy));
```

## Operations

- Auth: `AUTH_BASIC_SET`
- `HR_ORGANIZATION_SEARCH`
- `HR_JOB_APPLICANT_SEARCH`

## Development

Run `nx test service-adapters-breezy` and `nx build service-adapters-breezy`.
