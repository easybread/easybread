import { type CommandHandler } from '@easybread/core';

import type { BambooHrAuthStrategy } from '../bamboo-hr.auth-strategy';
import { BAMBOO_HR_COMMAND_NAME } from '../bamboo-hr.command-name';
import type { BambooJobApplicantSearchCommand } from '../commands';
import {
  bambooEmployeeAdapter,
  bambooPaginationAdapter,
} from '../data-adapters';
import { bambooApplicationsListQueryAdapter } from '../data-adapters/bamboo.applications-list.query.adapter';
import type {
  BambooApplicationList,
  BambooApplicationListQuery,
} from '../interfaces';

export const BambooJobApplicantSearchHandler: CommandHandler<
  BambooJobApplicantSearchCommand,
  BambooHrAuthStrategy
> = {
  name: BAMBOO_HR_COMMAND_NAME.HR_JOB_APPLICANT_SEARCH,
  async handle(input, context) {
    const { breadId } = input;
    const { companyName } = await context.auth.readAuthData(breadId);

    const { page } = bambooPaginationAdapter.toExternalParams(input.pagination);

    const result = await context.httpRequest<BambooApplicationList>({
      method: 'GET',
      url: `https://api.bamboohr.com/api/gateway.php/${companyName}/v1/applicant_tracking/applications`,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      params: {
        page,
        ...bambooApplicationsListQueryAdapter.toExternal(input.params),
      } satisfies BambooApplicationListQuery,
    });

    const payload = result.data.applications.map(a =>
      bambooEmployeeAdapter.toInternal(a.applicant),
    );

    return {
      success: true,
      breadId,
      payload,
      pagination: bambooPaginationAdapter.toInternalData({
        ...result.data,
        currentPage: page ?? 1,
      }),
      rawPayload: result.data,
    };
  },
};
