---
sidebar_position: 1
sidebar_label: Overview
---

# Breezy HR Adapter Overview

EasyBREAD service adapter for [Breezy HR](https://breezy.hr/).

## Installation

```bash
pnpm add @easybread/adapter-breezy
```

## Setup the client

The auth strategy is passed to the service adapter, which is then passed to the
`EasyBreadClient` together with a state adapter of your choice.

```ts
import { EasyBreadClient, InMemoryStateAdapter } from '@easybread/core';
import { BreezyAdapter, BreezyAuthStrategy } from '@easybread/adapter-breezy';

const stateAdapter = new InMemoryStateAdapter();
const authStrategy = new BreezyAuthStrategy(stateAdapter);
const serviceAdapter = new BreezyAdapter(authStrategy);

export const client = new EasyBreadClient(stateAdapter, serviceAdapter);
```

## Authentication

Breezy uses **Basic auth**. Exchange the account email and password for an access token
(stored transparently by EasyBREAD) with the `AUTH_BASIC_SET` operation.

```ts
import { BREEZY_COMMAND_NAME } from '@easybread/adapter-breezy';

export async function breezyAuthenticate(
  breadId: string,
  username: string,
  password: string,
) {
  const result = await client.invoke(BREEZY_COMMAND_NAME.AUTH_BASIC_SET, {
    breadId,
    params: null,
    payload: {
      '@context': 'https://schema.easybread.io/auth',
      '@type': 'CredentialBasic',
      username,
      password,
    },
  });

  if (result.success === false) {
    throw new Error('Breezy authentication failed', { cause: result.rawPayload });
  }
}
```

## Operations

| Operation | Description |
| --- | --- |
| `AUTH_BASIC_SET` | Sign in with email & password and store the access token. |
| `HR_ORGANIZATION_SEARCH` | List the organizations (companies) the account can access. |
| `HR_JOB_APPLICANT_SEARCH` | Search job applicants (candidates), returned as `PersonSchema[]`. |

### Organization Search

Pagination is not supported by the underlying Breezy companies endpoint, so use
`{ type: 'DISABLED' }`.

```ts
import { BREEZY_COMMAND_NAME } from '@easybread/adapter-breezy';
import type { OrganizationSchema } from '@easybread/schemas';

export async function breezyOrganizationSearch(
  breadId: string,
): Promise<OrganizationSchema[]> {
  const result = await client.invoke(BREEZY_COMMAND_NAME.HR_ORGANIZATION_SEARCH, {
    breadId,
    params: null,
    pagination: { type: 'DISABLED' },
  });

  if (result.success === false) {
    throw new Error('Breezy organization search failed', { cause: result.rawPayload });
  }

  return result.payload;
}
```
