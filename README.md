<div align="center">
  <img src="./docs/easybread/app/static/img/easybread_logo.png" alt="EasyBREAD" width="120" />

  <h1>EasyBREAD</h1>

  <p><strong>An opinionated TypeScript framework for building third-party API integrations behind a single, unified data model and interface.</strong></p>
</div>

---

## What is EasyBREAD?

Integrating with external APIs (HR systems, directories, chat platforms, …) usually
means learning each provider's bespoke authentication, data shapes and pagination.
EasyBREAD hides that complexity behind a small, consistent surface:

- **One client, one interface.** You talk to every provider through a single
  `EasyBreadClient.invoke(operation, input)` call.
- **One data model.** Inputs and outputs use **BreadSchema** types derived from the
  [Schema.org](https://schema.org/) vocabulary, so a `PersonSchema` looks the same
  whether it came from Google or BambooHR. The raw provider response is always
  available on `rawPayload` when you need it.
- **Auth & multitenancy handled for you.** OAuth 2.0 tokens, refresh flows and Basic
  auth credentials are stored and replayed transparently, keyed by a `breadId` you
  control. A single application can hold many independent connections to the same API.
- **Pluggable adapters.** Service, auth, state and data adapters are interchangeable
  building blocks, so you can swap storage backends or add new providers without
  touching application code.

> 📖 Full documentation lives in the [Docusaurus site](./docs/easybread/app) (see
> [Getting Started](./docs/easybread/app/docs/guide/getting-started.md) and the
> [Mental Model](./docs/easybread/app/docs/guide/mental-model.md)) and on the
> project [Wiki](https://github.com/easybread/easybread/wiki).

## How it works

```
Application ──▶ EasyBreadClient ──▶ ServiceAdapter ──▶ External API
                                       │  ▲
                                       │  └── DataAdapter   (maps to/from BreadSchema)
                                       └───── AuthStrategy ──▶ StateAdapter (stores AuthData)
```

Everything you do — including authentication — is expressed as an **Operation**. The
client passes the operation to a **ServiceAdapter**, which uses an **AuthStrategy**
(backed by a **StateAdapter**) to authorize the request and a **DataAdapter** to map
between the unified schema and the provider's format.

## Quick start

```shell
pnpm add @easybread/core @easybread/schemas @easybread/commands
# then add the service adapter(s) you need, e.g.:
pnpm add @easybread/adapter-google-common @easybread/adapter-google-admin-directory
```

```ts
import { EasyBreadClient, InMemoryStateAdapter } from '@easybread/core';
import {
  GoogleAdminDirectoryAdapter,
  GoogleAdminDirectoryAuthStrategy,
  GoogleAdminDirectoryOperationName,
} from '@easybread/adapter-google-admin-directory';

const stateAdapter = new InMemoryStateAdapter();
const authStrategy = new GoogleAdminDirectoryAuthStrategy(stateAdapter, {
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  redirectUri: process.env.GOOGLE_REDIRECT_URI!,
});
const serviceAdapter = new GoogleAdminDirectoryAdapter(authStrategy);

const client = new EasyBreadClient(stateAdapter, serviceAdapter);

const { payload } = await client.invoke(
  GoogleAdminDirectoryOperationName.USERS_SEARCH,
  { breadId: 'tenant-1', params: { query: 'jane' } },
);
```

See the [Getting Started guide](./docs/easybread/app/docs/guide/getting-started.md)
for the full authentication walkthrough.

## Packages

This repository is an [Nx](https://nx.dev) + [pnpm](https://pnpm.io) monorepo. The
published libraries live under [`packages/`](./packages):

### Core libraries

| Package | Description |
| --- | --- |
| [`@easybread/core`](./packages/core) | The `EasyBreadClient`, operation executor, base adapter classes and the built-in `InMemoryStateAdapter`. |
| [`@easybread/commands`](./packages/commands) | Canonical `BREAD_COMMAND_NAME` operation catalog and command/output types shared by every adapter. |
| [`@easybread/schemas`](./packages/schemas) | The Schema.org-derived **BreadSchema** types (e.g. `PersonSchema`) used for all operation inputs and outputs. |
| [`@easybread/common`](./packages/common) | Low-level type helpers and enum utilities (`enumPickKeys`, `enumMerge`, …) used across the codebase. |

### Adapter toolkit

| Package | Description |
| --- | --- |
| [`@easybread/data-adapter`](./packages/data-adapter) | `breadDataAdapter` — declarative two-way mapping between external and internal data shapes. |
| [`@easybread/data-mapper`](./packages/data-mapper) | The lower-level property-mapping engine that powers the data adapter. |
| [`@easybread/pagination-adapter`](./packages/pagination-adapter) | Normalizes provider-specific pagination into the unified `PREV_NEXT` / `OFFSET` models. |

### State adapters

| Package | Description |
| --- | --- |
| [`@easybread/state-adapter-mongo`](./packages/state-adapter-mongo) | MongoDB-backed `StateAdapter` for persisting auth data outside of memory. |

### Service adapters

| Package | Provider | Operations |
| --- | --- | --- |
| [`@easybread/adapter-bamboo-hr`](./packages/service-adapters/bamboo-hr) | BambooHR | Basic / OpenID Connect auth, employee BREAD, job application & applicant search |
| [`@easybread/adapter-breezy`](./packages/service-adapters/breezy) | Breezy HR | Basic auth, organization search, job applicant search |
| [`@easybread/adapter-google-common`](./packages/service-adapters/google/common) | Google | Shared Google OAuth 2.0 auth flow used by the Google adapters |
| [`@easybread/adapter-google-admin-directory`](./packages/service-adapters/google/admin-directory) | Google Admin Directory | OAuth 2.0 auth, user BREAD operations |
| [`@easybread/adapter-google-contacts`](./packages/service-adapters/google/contacts) | Google Contacts | OAuth 2.0 auth, contact BREAD operations |
| [`@easybread/adapter-rocket-chat-common`](./packages/service-adapters/rocket-chat/common) | Rocket.Chat | Shared Rocket.Chat Basic auth |
| [`@easybread/adapter-rocket-chat-users`](./packages/service-adapters/rocket-chat/users) | Rocket.Chat | Basic auth, user search & lookup |

### Internal-only

| Package | Description |
| --- | --- |
| [`@easybread/test-utils`](./packages/test-utils) | Shared testing helpers (not published). |

## Apps & docs

- [`apps/saas`](./apps/saas) — a Next.js + tRPC SaaS reference application built on top of EasyBREAD.
- [`playground`](./playground) — a sandbox app for exercising the adapters locally.
- [`docs/easybread/app`](./docs/easybread/app) — the Docusaurus documentation site.

## Development

This repo uses **pnpm** (pinned via the `packageManager` field) and **Nx**.

```shell
pnpm install            # install dependencies
pnpm local:up           # start local services (docker compose)
pnpm local:down         # stop local services

# Nx targets (run for one project or with run-many / affected)
pnpm exec nx run-many -t build        # build all packages
pnpm exec nx run-many -t test         # run all unit tests
pnpm exec nx run-many -t lint         # lint everything
pnpm exec nx test @easybread/core     # target a single project
```

Releases are managed with `pnpm bump` (`nx release`) and published from CI on tag pushes.

## Contributing

Issues and pull requests are welcome. Please run `lint`, `build` and `test` for the
projects you touch before opening a PR — CI runs the same targets via `nx affected`.
