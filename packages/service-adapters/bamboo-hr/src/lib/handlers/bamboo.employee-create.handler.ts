import { AxiosResponse } from 'axios';

import { type CommandHandler } from '@easybread/core';

import { BambooHrAuthStrategy } from '../bamboo-hr.auth-strategy';
import { BAMBOO_HR_COMMAND_NAME } from '../bamboo-hr.command-name';
import type { BambooEmployeeCreateCommand } from '../commands';
import { bambooEmployeeAdapter } from '../data-adapters';
import { BambooEmployee } from '../interfaces';

export const BambooEmployeeCreateHandler: CommandHandler<
  BambooEmployeeCreateCommand,
  BambooHrAuthStrategy
> = {
  name: BAMBOO_HR_COMMAND_NAME.HR_EMPLOYEE_CREATE,
  async handle(input, context) {
    const { breadId, payload } = input;

    const { companyName } = await context.auth.readAuthData(breadId);

    const response = await context.httpRequest<BambooEmployee>({
      method: 'POST',
      url: `https://api.bamboohr.com/api/gateway.php/${companyName}/v1/employees`,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: bambooEmployeeAdapter.toExternal(payload),
    });

    const identifier = getIdentifierFromHeaders(response);

    return {
      success: true,
      breadId,
      payload: { ...payload, identifier },
      rawPayload: null,
    };
  },
};

function getIdentifierFromHeaders(response: AxiosResponse): string {
  // location is like
  // `https://api.bamboohr.com/api/gateway.php/<company_name>/v1/employees/<id_number>`
  return response.headers['location'].replace(/.+\/([^/]+)$/, '$1');
}
