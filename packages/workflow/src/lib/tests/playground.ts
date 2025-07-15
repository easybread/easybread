import {
  BambooHrAdapter,
  BambooHrAuthStrategy,
} from '@easybread/adapter-bamboo-hr';
import { EasyBreadClient, InMemoryStateAdapter } from '@easybread/core';

import { Step } from '../Step';
import { Workflow, WorkflowRunnerLocal } from '../workflow';

import { upsertUserInDB } from './mock';

const stateAdapter = new InMemoryStateAdapter();
const authStrategy = new BambooHrAuthStrategy(stateAdapter);
const serviceAdapter = new BambooHrAdapter(authStrategy);
const client = new EasyBreadClient(stateAdapter, serviceAdapter);

export async function main() {
  const TENNANT_ID = 'tennant-1';

  const getEmployees = Step.Command(
    'getEmployees',
    client,
    'BREAD/HR_EMPLOYEE_SEARCH',
  );
  const employees = await getEmployees.execute({
    breadId: 'breadId',
    pagination: { type: 'DISABLED' },
    params: {
      '@type': 'SearchAction' as const,
      identifier: 'userId',
    },
  });

  const migrateUser = Workflow.startAt(
    Step.Function('Initialize', (params: { userId: string }) => ({
      userId: params.userId,
      tenantId: TENNANT_ID,
    })),
  )
    .pipe(Step.Command('GetEmployeeById', client, 'BREAD/HR_EMPLOYEE_BY_ID'), {
      breadId: 'tenantId',
      params: {
        '@type': _ => 'Person' as const,
        identifier: 'userId',
      },
      payload: 'NO_MAP',
    })
    .pipe(Step.Function('UpsertUserInDB', upsertUserInDB), {
      email: f => f.payload.email ?? '',
      name: f => f.payload.name ?? '',
      orgId: 'breadId',
    });

  const runner = WorkflowRunnerLocal.make(migrateUser);
  const result = await runner.run({ userId: '1' });
}
