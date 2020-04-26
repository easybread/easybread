import { BreadOperationHandler, ServiceException } from '@easybread/core';
import {
  BreadOperationName,
  EmployeeCreateOperation
} from '@easybread/operations';
import { AxiosResponse } from 'axios';
import { Person } from 'schema-dts';

import { BambooHrAuthStrategy } from '../bamboo-hr.auth-strategy';
import { BAMBOO_HR_PROVIDER } from '../bamboo-hr.constants';
import { bambooPersonToEmployeeTransform } from '../transform';

export const BambooEmployeeCreateHandler: BreadOperationHandler<
  EmployeeCreateOperation,
  BambooHrAuthStrategy
> = {
  name: BreadOperationName.EMPLOYEE_CREATE,
  async handle(input, context) {
    const { breadId, payload } = input;

    if (typeof payload === 'string') {
      throw new ServiceException(
        BAMBOO_HR_PROVIDER,
        'String Person is not allowed'
      );
    }

    const { companyName } = await context.auth.readAuthData(breadId);

    const response = await context.httpRequest<undefined>({
      method: 'POST',
      url: `https://api.bamboohr.com/api/gateway.php/${companyName}/v1/employees`,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      },
      data: bambooPersonToEmployeeTransform(payload as Person)
    });

    return {
      name: BreadOperationName.EMPLOYEE_CREATE,
      payload: {
        ...payload,
        identifier: getIdentifierFromHeaders(response)
      },
      rawPayload: {
        success: true,
        data: {}
      }
    };
  }
};

function getIdentifierFromHeaders(response: AxiosResponse): string {
  // location is like
  // `https://api.bamboohr.com/api/gateway.php/<company_name>/v1/employees/<id_number>`
  return response.headers.location.replace(/.+\/(\d+)$/, '$1');
}
