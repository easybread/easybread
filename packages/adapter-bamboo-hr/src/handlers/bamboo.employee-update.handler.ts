import { BreadOperationHandler } from '@easybread/core';
import {
  BreadOperationName,
  EmployeeUpdateOperation
} from '@easybread/operations';

import { BambooHrAuthStrategy } from '../bamboo-hr.auth-strategy';
import { BambooEmployeeMapper } from '../data-mappers';

export const BambooEmployeeUpdateHandler: BreadOperationHandler<
  EmployeeUpdateOperation,
  BambooHrAuthStrategy
> = {
  async handle(input, context) {
    const { breadId, payload } = input;

    const { companyName } = await context.auth.readAuthData(breadId);

    const dataMapper = new BambooEmployeeMapper();

    await context.httpRequest<undefined>({
      method: 'POST',
      url: `https://api.bamboohr.com/api/gateway.php/${companyName}/v1/employees/${payload.identifier}`,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      },
      data: dataMapper.toRemote(payload)
    });

    return {
      name: BreadOperationName.EMPLOYEE_UPDATE,
      payload: payload,
      rawPayload: {
        success: true,
        data: {}
      }
    };
  },
  name: BreadOperationName.EMPLOYEE_UPDATE
};
