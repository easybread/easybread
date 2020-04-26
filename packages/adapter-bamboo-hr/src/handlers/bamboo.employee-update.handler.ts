import { BreadOperationHandler, ServiceException } from '@easybread/core';
import {
  BreadOperationName,
  EmployeeUpdateOperation
} from '@easybread/operations';
import { Person } from 'schema-dts';

import { BambooHrAuthStrategy } from '../bamboo-hr.auth-strategy';
import { BAMBOO_HR_PROVIDER } from '../bamboo-hr.constants';
import { bambooPersonToEmployeeTransform } from '../transform';

export const BambooEmployeeUpdateHandler: BreadOperationHandler<
  EmployeeUpdateOperation,
  BambooHrAuthStrategy
> = {
  async handle(input, context) {
    const { breadId, payload } = input;

    if (typeof payload === 'string') {
      throw new ServiceException(
        BAMBOO_HR_PROVIDER,
        'String Person is not allowed'
      );
    }

    const { companyName } = await context.auth.readAuthData(breadId);

    await context.httpRequest<undefined>({
      method: 'POST',
      url: `https://api.bamboohr.com/api/gateway.php/${companyName}/v1/employees/${payload.identifier}`,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      },
      data: bambooPersonToEmployeeTransform(payload as Person)
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
