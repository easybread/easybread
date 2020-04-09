import { BreadOperationHandler, BreadOperationName } from '../../../operation';
import { EmployeeSearchOperation } from '../../../operations';
import { BambooHrAuthStrategy } from '../bamboo-hr.auth-strategy';
import { BambooEmployeesDirectory } from '../interfaces';
import { employeeToPersonTransform } from '../transform';

export const EmployeeSearchHandler: BreadOperationHandler<
  EmployeeSearchOperation,
  BambooHrAuthStrategy
> = {
  name: BreadOperationName.EMPLOYEE_SEARCH,

  async handle(input, context) {
    const { breadId } = input;

    const { companyName } = await context.auth.readAuthData(breadId);

    const result = await context.httpRequest<BambooEmployeesDirectory>({
      method: 'GET',
      // TODO: refactor: build base url with company in one place
      url: `https://api.bamboohr.com/api/gateway.php/${companyName}/v1/employees/directory`,
      headers: { accept: 'application/json' }
    });

    return {
      name: BreadOperationName.EMPLOYEE_SEARCH,
      payload: result.data.employees.map(employeeToPersonTransform),
      rawPayload: {
        success: true,
        data: result.data
      }
    };
  }
};
