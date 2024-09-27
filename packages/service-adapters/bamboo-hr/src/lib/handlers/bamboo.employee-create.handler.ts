import {
  BreadOperationHandler,
  createSuccessfulOutputWithRawDataAndPayload,
} from '@easybread/core';
import { BreadOperationName } from '@easybread/operations';
import { AxiosResponse } from 'axios';

import { BambooHrAuthStrategy } from '../bamboo-hr.auth-strategy';
import { bambooEmployeeAdapter } from '../data-adapters';
import type { BambooHrEmployeeCreateOperation } from '../bamboo-hr.operation';

export const BambooEmployeeCreateHandler: BreadOperationHandler<
  BambooHrEmployeeCreateOperation,
  BambooHrAuthStrategy
> = {
  name: BreadOperationName.EMPLOYEE_CREATE,
  async handle(input, context) {
    const { breadId, payload } = input;

    const { companyName } = await context.auth.readAuthData(breadId);

    const response = await context.httpRequest<undefined>({
      method: 'POST',
      url: `https://api.bamboohr.com/api/gateway.php/${companyName}/v1/employees`,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: bambooEmployeeAdapter.toExternal(payload),
    });

    return createSuccessfulOutputWithRawDataAndPayload(
      BreadOperationName.EMPLOYEE_CREATE,
      {},
      {
        ...payload,
        identifier: getIdentifierFromHeaders(response),
      }
    );
  },
};

function getIdentifierFromHeaders(response: AxiosResponse): string {
  // location is like
  // `https://api.bamboohr.com/api/gateway.php/<company_name>/v1/employees/<id_number>`
  return response.headers['location'].replace(/.+\/(\d+)$/, '$1');
}
