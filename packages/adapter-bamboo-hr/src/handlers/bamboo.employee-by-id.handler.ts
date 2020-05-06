import { BreadOperationHandler } from '@easybread/core';
import {
  BreadOperationName,
  EmployeeByIdOperation
} from '@easybread/operations';

import { BambooHrAuthStrategy } from '../bamboo-hr.auth-strategy';
import { BambooEmployeeMapper } from '../data-mappers';
import { BambooEmployee } from '../interfaces';

export const BambooEmployeeByIdHandler: BreadOperationHandler<
  EmployeeByIdOperation<BambooEmployee>,
  BambooHrAuthStrategy
> = {
  name: BreadOperationName.EMPLOYEE_BY_ID,
  async handle(input, context) {
    const { breadId, params } = input;

    const { companyName } = await context.auth.readAuthData(breadId);

    const response = await context.httpRequest<BambooEmployee>({
      method: 'GET',
      url: `https://api.bamboohr.com/api/gateway.php/${companyName}/v1/employees/${params.identifier}`,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      },
      params: {
        // TODO: come up with a good way to keep it consistent
        //       with the BambooEmployee interface definition
        fields: [
          'canUploadPhoto',
          'department',
          'displayName',
          'division',
          'firstName',
          'gender',
          'jobTitle',
          'lastName',
          'linkedIn',
          'location',
          'mobilePhone',
          'photoUploaded',
          'photoUrl',
          'preferredName',
          'workEmail',
          'workPhone',
          'workPhoneExtension',
          'skypeUsername'
        ]
      }
    });

    const dataMapper = new BambooEmployeeMapper();

    return {
      name: BreadOperationName.EMPLOYEE_BY_ID,
      payload: dataMapper.toSchema(response.data),
      rawPayload: {
        success: true,
        data: response.data
      }
    };
  }
};
