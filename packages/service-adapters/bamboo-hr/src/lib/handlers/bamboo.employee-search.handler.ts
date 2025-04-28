import { find, isNumber, isObject, isString, pick } from 'lodash';

import { type CommandHandler, PAGINATION_TYPE } from '@easybread/core';
import { OrganizationSchema, PersonSchema } from '@easybread/schemas';

import { BambooHrAuthStrategy } from '../bamboo-hr.auth-strategy';
import { BAMBOO_HR_COMMAND_NAME } from '../bamboo-hr.command-name';
import type { BambooEmployeeSearchCommand } from '../commands';
import { bambooEmployeeAdapter } from '../data-adapters';
import { BambooEmployeesDirectory } from '../interfaces';

export const BambooEmployeeSearchHandler: CommandHandler<
  BambooEmployeeSearchCommand,
  BambooHrAuthStrategy
> = {
  name: BAMBOO_HR_COMMAND_NAME.HR_EMPLOYEE_SEARCH,

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

        value => {
          if (isString(value)) return queryRegExp.test(value);
          if (isNumber(value)) return queryRegExp.test(`${value}`);

          if (Array.isArray(value)) {
            return value.some(s => queryRegExp.test(s));
          }

          if (isObject(value) && value !== null) {
            if (value['@type'] === 'Organization') {
              const { name, alternateName } = value as OrganizationSchema;
              return !![name, alternateName].find(
                v => v && queryRegExp.test(v),
              );
            }
          }

          return false;
        },
      );
    };

    // bamboo-hr doesn't provide search API. But we can search with filter
    const payload = result.data.employees
      .map(bambooEmployeeAdapter.toInternal)
      .filter(searchFilter);

    return {
      success: true,
      breadId: input.breadId,
      payload,
      rawPayload: result.data,
      pagination: { type: PAGINATION_TYPE.DISABLED },
    };
  },
};
