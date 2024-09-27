import {
  BreadOperationHandler,
  createSuccessfulOutputWithRawDataAndPayload,
} from '@easybread/core';
import { BreadOperationName } from '@easybread/operations';

import { BambooHrAuthStrategy } from '../bamboo-hr.auth-strategy';
import { bambooEmployeeAdapter } from '../data-adapters';
import type { BambooHrEmployeeUpdateOperation } from '../bamboo-hr.operation';

export const BambooEmployeeUpdateHandler: BreadOperationHandler<
  BambooHrEmployeeUpdateOperation,
  BambooHrAuthStrategy
> = {
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

    return createSuccessfulOutputWithRawDataAndPayload(
      BreadOperationName.EMPLOYEE_UPDATE,
      {},
      payload
    );
  },
  name: BreadOperationName.EMPLOYEE_UPDATE,
};
