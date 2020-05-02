import { BreadOperationHandler } from '@easybread/core';
import {
  BreadOperationName,
  EmployeeCreateOperation
} from '@easybread/operations';
import { AxiosResponse } from 'axios';

import { BambooHrAuthStrategy } from '../bamboo-hr.auth-strategy';
import { BambooEmployeeMapper } from '../data-mappers';

export const BambooEmployeeCreateHandler: BreadOperationHandler<
  EmployeeCreateOperation,
  BambooHrAuthStrategy
> = {
  name: BreadOperationName.EMPLOYEE_CREATE,
  async handle(input, context) {
    const { breadId, payload } = input;

    const { companyName } = await context.auth.readAuthData(breadId);

    const dataMapper = new BambooEmployeeMapper();
    const response = await context.httpRequest<undefined>({
      method: 'POST',
      url: `https://api.bamboohr.com/api/gateway.php/${companyName}/v1/employees`,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      },
      data: dataMapper.toRemote(payload)
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
