---
sidebar_position: 1
sidebar_label: Overview
---

# Bamboo HR Adapter Overview

## Installation

```bash
pnpm add @easybread/adapter-bamboo-hr
```

## Setup the client

Instantiate the `EasyBreadClient` with the `BambooHrAdapter`, `BambooHrAuthStrategy`,
and a state adapter of your choice.

```ts
import { EasyBreadClient, InMemoryStateAdapter } from '@easybread/core';
import { BambooHrAdapter } from '@easybread/adapter-bamboo-hr';

import { stateAdapter } from '~/easybread/state';

const serviceAdapter = new BambooHrAdapter();
const authStrategy = new BambooHrAuthStrategy(stateAdapter);

export const client = new EasyBreadClient(stateAdapter, serviceAdapter, authStrategy);
```

If you're going to use the OpenID Connect Authentication, also follow the
[Bamboo HR OpenID Connect Authentication Guide](./authentication.md#openid-connect-authentication).
