import { type CommandHandler } from '@easybread/core';

import type { BambooHrAuthStrategy } from '../bamboo-hr.auth-strategy';
import { BAMBOO_HR_COMMAND_NAME } from '../bamboo-hr.command-name';
import type { BambooJobApplicationSearchCommand } from '../commands';
import { bambooPaginationAdapter } from '../data-adapters';
import { bambooApplicationAdapter } from '../data-adapters/bamboo.application.adapter';
import { bambooApplicationsListQueryAdapter } from '../data-adapters/bamboo.applications-list.query.adapter';
import type {
  BambooApplicationList,
  BambooApplicationListQuery,
} from '../interfaces';

export const BambooJobApplicationSearchHandler: CommandHandler<
  BambooJobApplicationSearchCommand,
  BambooHrAuthStrategy
> = {
  name: BAMBOO_HR_COMMAND_NAME.HR_JOB_APPLICATION_SEARCH,
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

    const payload = result.data.applications.map(
      bambooApplicationAdapter.toInternal,
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
