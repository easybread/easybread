import {
  type BreadOperationHandler,
  createSuccessfulCollectionOutputWithRawDataAndPayload,
} from '@easybread/core';
import { BreadOperationName } from '@easybread/operations';

import type { BambooHrAuthStrategy } from '../bamboo-hr.auth-strategy';
import type {
  BambooApplicationList,
  BambooApplicationListQuery,
} from '../interfaces';
import { bambooPaginationAdapter } from '../data-adapters';
import { bambooApplicationAdapter } from '../data-adapters/bamboo.application.adapter';
import { bambooApplicationsListQueryAdapter } from '../data-adapters/bamboo.applications-list.query.adapter';
import type { BambooHrJobApplicationSearchOperation } from '../bamboo-hr.operation';

export const BambooJobApplicationSearchHandler: BreadOperationHandler<
  BambooHrJobApplicationSearchOperation,
  BambooHrAuthStrategy
> = {
  name: BreadOperationName.JOB_APPLICATION_SEARCH,
  async handle(input, context) {
    const { breadId } = input;
    const { companyName } = await context.auth.readAuthData(breadId);

    const result = await context.httpRequest<BambooApplicationList>({
      method: 'GET',
      url: `https://api.bamboohr.com/api/gateway.php/${companyName}/v1/applicant_tracking/applications`,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      params: {
        ...bambooPaginationAdapter.toExternalParams(input.pagination),
        ...bambooApplicationsListQueryAdapter.toExternal(input.params),
      } satisfies BambooApplicationListQuery,
    });

    const payload = result.data.applications.map(
      bambooApplicationAdapter.toInternal
    );

    return createSuccessfulCollectionOutputWithRawDataAndPayload(
      BreadOperationName.JOB_APPLICATION_SEARCH,
      result.data,
      payload,
      bambooPaginationAdapter.toInternalData(result.data)
    );
  },
};
