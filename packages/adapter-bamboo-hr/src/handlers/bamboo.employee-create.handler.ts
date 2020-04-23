import { BreadOperationHandler } from '@easybread/core';
import {
  BreadOperationName,
  EmployeeCreateOperation
} from '@easybread/operations';
import { Person } from 'schema-dts';

import { BambooHrAuthStrategy } from '../bamboo-hr.auth-strategy';
import { bambooPersonToEmployeeTransform } from '../transform';

export const BambooEmployeeCreateHandler: BreadOperationHandler<
  EmployeeCreateOperation,
  BambooHrAuthStrategy
> = {
  name: BreadOperationName.EMPLOYEE_CREATE,
  async handle(input, context) {
    const { breadId, payload } = input;

    const { companyName } = await context.auth.readAuthData(breadId);

    await context.httpRequest<undefined>({
      method: 'POST',
      url: `https://api.bamboohr.com/api/gateway.php/${companyName}/v1/employees`,
      headers: { accept: 'application/json' },
      data: bambooPersonToEmployeeTransform(payload as Person)
    });

    return {
      name: BreadOperationName.EMPLOYEE_CREATE,
      // bamboo api doesn't return any data, just 201 status code.
      // so we return the Person from input for the sake of consistency
      payload: payload,
      rawPayload: {
        success: true,
        data: {}
      }
    };
  }
};
