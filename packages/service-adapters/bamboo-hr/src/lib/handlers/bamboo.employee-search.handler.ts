import {
  BreadOperationHandler,
  createDisabledPagination,
  createSuccessfulCollectionOutputWithRawDataAndPayload,
} from '@easybread/core';
import { BreadOperationName } from '@easybread/operations';
import { OrganizationSchema, PersonSchema } from '@easybread/schemas';
import { find, isNumber, isObject, isString, pick } from 'lodash';

import { BambooHrAuthStrategy } from '../bamboo-hr.auth-strategy';
import { bambooEmployeeAdapter } from '../data-adapters';
import { BambooEmployeesDirectory } from '../interfaces';
import type { BambooHrEmployeeSearchOperation } from '../bamboo-hr.operation';

export const BambooEmployeeSearchHandler: BreadOperationHandler<
  BambooHrEmployeeSearchOperation,
  BambooHrAuthStrategy
> = {
  name: BreadOperationName.EMPLOYEE_SEARCH,

  async handle(input, context) {
    const { breadId } = input;
    const { query = '' } = input.params;

    const { companyName } = await context.auth.readAuthData(breadId);

    const result = await context.httpRequest<BambooEmployeesDirectory>({
      method: 'GET',
      // TODO (priority): refactor: build base url with company in one place
      url: `https://api.bamboohr.com/api/gateway.php/${companyName}/v1/employees/directory`,
      headers: { accept: 'application/json' },
    });

    const queryRegExp = new RegExp(query, 'i');
    const searchFilter = (schema: PersonSchema): boolean => {
      return !!find(
        pick(schema, [
          'email',
          'name',
          'givenName',
          'familyName',
          'workLocation',
          'worksFor',
          'jobTitle',
        ] as (keyof PersonSchema)[]),

        (value) => {
          if (isString(value)) return queryRegExp.test(value);
          if (isNumber(value)) return queryRegExp.test(`${value}`);

          if (Array.isArray(value)) {
            return value.some((s) => queryRegExp.test(s));
          }

          if (isObject(value)) {
            if (value['@type'] === 'Organization') {
              const { name, alternateName } = value as OrganizationSchema;
              return !![name, alternateName].find(
                (v) => v && queryRegExp.test(v)
              );
            }
          }

          return false;
        }
      );
    };

    // bamboo-hr doesn't provide search API. But we can search with filter
    const payload = result.data.employees
      .map((e) => bambooEmployeeAdapter.toInternal(e))
      .filter(searchFilter);

    return createSuccessfulCollectionOutputWithRawDataAndPayload(
      BreadOperationName.EMPLOYEE_SEARCH,
      result.data,
      payload,
      createDisabledPagination()
    );
  },
};
