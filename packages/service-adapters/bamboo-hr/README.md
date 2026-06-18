# @easybread/adapter-bamboo-hr

[EasyBREAD](../../../README.md) service adapter for [BambooHR](https://www.bamboohr.com/).

## Install

```shell
pnpm add @easybread/adapter-bamboo-hr
```

## Authentication

Supports both **Basic auth** (API key) and **OpenID Connect**. Instantiate
`BambooHrAuthStrategy` with a state adapter of your choice:

```ts
import { EasyBreadClient, InMemoryStateAdapter } from '@easybread/core';
import { BambooHrAdapter, BambooHrAuthStrategy } from '@easybread/adapter-bamboo-hr';

const stateAdapter = new InMemoryStateAdapter();
const authStrategy = new BambooHrAuthStrategy(stateAdapter);
const serviceAdapter = new BambooHrAdapter(authStrategy);

const client = new EasyBreadClient(stateAdapter, serviceAdapter);
```

## Operations

- Auth: `AUTH_BASIC_SET`, `AUTH_OIDC_START`, `AUTH_OIDC_COMPLETE`
- Employees: `HR_EMPLOYEE_SEARCH`, `HR_EMPLOYEE_BY_ID`, `HR_EMPLOYEE_CREATE`, `HR_EMPLOYEE_UPDATE`
- Recruiting: `HR_JOB_APPLICATION_SEARCH`, `HR_JOB_APPLICANT_SEARCH`

See the [BambooHR adapter docs](../../../docs/easybread/app/docs/adapters/Bamboo%20HR/overview.md)
for the full setup and authentication walkthrough.

## Development

Run `nx test service-adapters-bamboo-hr` and `nx build service-adapters-bamboo-hr`.
