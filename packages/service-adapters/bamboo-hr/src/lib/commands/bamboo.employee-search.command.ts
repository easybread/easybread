import { type CommandPaginated, PAGINATION_TYPE } from '@easybread/core';
import { PersonSchema, type SearchActionSchema } from '@easybread/schemas';

import { BAMBOO_HR_COMMAND_NAME } from '../bamboo-hr.command-name';
import { BambooEmployeesDirectory } from '../interfaces';

export type BambooEmployeeSearchCommand = CommandPaginated<
  typeof PAGINATION_TYPE.DISABLED,
  typeof BAMBOO_HR_COMMAND_NAME.HR_EMPLOYEE_SEARCH,
  SearchActionSchema,
  PersonSchema[],
  BambooEmployeesDirectory
>;
