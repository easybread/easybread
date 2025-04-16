import { type CommandHandler } from '@easybread/core';

import { BambooHrAuthStrategy } from '../bamboo-hr.auth-strategy';
import { BAMBOO_HR_COMMAND_NAME } from '../bamboo-hr.command-name';
import type { BambooEmployeeUpdateCommand } from '../commands';
import { bambooEmployeeAdapter } from '../data-adapters';

export const BambooEmployeeUpdateHandler: CommandHandler<
  BambooEmployeeUpdateCommand,
  BambooHrAuthStrategy
> = {
  name: BAMBOO_HR_COMMAND_NAME.HR_EMPLOYEE_UPDATE,
  async handle(input, context) {
    const { breadId, payload } = input;

    const { companyName } = await context.auth.readAuthData(breadId);

    await context.httpRequest<undefined>({
      method: 'POST',
      url: `https://api.bamboohr.com/api/gateway.php/${companyName}/v1/employees/${payload.identifier}`,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: bambooEmployeeAdapter.toExternal(payload),
    });

    return {
      success: true,
      breadId,
      payload,
      rawPayload: null,
    };
  },
};
