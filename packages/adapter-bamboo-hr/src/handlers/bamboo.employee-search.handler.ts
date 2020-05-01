import { BreadOperationHandler } from '@easybread/core';
import {
  BreadOperationName,
  EmployeeSearchOperation
} from '@easybread/operations';

import { BambooHrAuthStrategy } from '../bamboo-hr.auth-strategy';
import { BambooEmployeeMapper } from '../data-mappers';
import { BambooEmployeesDirectory } from '../interfaces';

export const BambooEmployeeSearchHandler: BreadOperationHandler<
  EmployeeSearchOperation<BambooEmployeesDirectory>,
  BambooHrAuthStrategy
> = {
  name: BreadOperationName.EMPLOYEE_SEARCH,

  async handle(input, context) {
    const { breadId } = input;

    const { companyName } = await context.auth.readAuthData(breadId);

    const result = await context.httpRequest<BambooEmployeesDirectory>({
      method: 'GET',
      // TODO (priority): refactor: build base url with company in one place
      url: `https://api.bamboohr.com/api/gateway.php/${companyName}/v1/employees/directory`,
      headers: { accept: 'application/json' }
    });

    const dataMapper = new BambooEmployeeMapper();
    return {
      name: BreadOperationName.EMPLOYEE_SEARCH,
      payload: result.data.employees.map(e => dataMapper.toSchema(e)),
      rawPayload: {
        success: true,
        data: result.data
      }
    };
  }
};
