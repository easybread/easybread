import { type CommandHandler } from '@easybread/core';

import { BambooHrAuthStrategy } from '../bamboo-hr.auth-strategy';
import { BAMBOO_HR_COMMAND_NAME } from '../bamboo-hr.command-name';
import type { BambooEmployeeByIdCommand } from '../commands';
import { BAMBOO_EMPLOYEE_FIELD_LIST } from '../constants/bamboo.employee-field-list';
import { bambooEmployeeAdapter } from '../data-adapters';
import { BambooEmployee } from '../interfaces';

export const BambooEmployeeByIdHandler: CommandHandler<
  BambooEmployeeByIdCommand,
  BambooHrAuthStrategy
> = {
  name: BAMBOO_HR_COMMAND_NAME.HR_EMPLOYEE_BY_ID,
  async handle(input, context) {
    const { breadId, params } = input;

    const { companyName } = await context.auth.readAuthData(breadId);

    const response = await context.httpRequest<BambooEmployee>({
      method: 'GET',
      url: `https://api.bamboohr.com/api/gateway.php/${companyName}/v1/employees/${params.identifier}`,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      params: {
        fields: BAMBOO_EMPLOYEE_FIELD_LIST.join(','),
      },
    });

    return {
      success: true,
      breadId,
      payload: bambooEmployeeAdapter.toInternal(response.data),
      rawPayload: response.data,
    };
  },
};
