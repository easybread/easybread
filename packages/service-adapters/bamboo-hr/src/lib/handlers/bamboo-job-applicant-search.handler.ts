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
import {
  bambooEmployeeAdapter,
  bambooPaginationAdapter,
} from '../data-adapters';
import { bambooApplicationsListQueryAdapter } from '../data-adapters/bamboo.applications-list.query.adapter';
import type { BambooHrJobApplicantSearchOperation } from '../bamboo-hr.operation';

export const BambooJobApplicantSearchHandler: BreadOperationHandler<
  BambooHrJobApplicantSearchOperation,
  BambooHrAuthStrategy
> = {
  name: BreadOperationName.JOB_APPLICANT_SEARCH,
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

    const payload = result.data.applications.map((a) =>
      bambooEmployeeAdapter.toInternal(a.applicant)
    );

    return createSuccessfulCollectionOutputWithRawDataAndPayload(
      BreadOperationName.JOB_APPLICANT_SEARCH,
      result.data,
      payload,
      bambooPaginationAdapter.toInternalData(result.data)
    );
  },
};
