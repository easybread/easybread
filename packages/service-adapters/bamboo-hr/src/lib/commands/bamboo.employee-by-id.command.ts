import type { CommandStandard } from '@easybread/core';
import type { PersonSchema, SchemaPick } from '@easybread/schemas';

import type { BAMBOO_HR_COMMAND_NAME } from '../bamboo-hr.command-name';
import type { BambooEmployee } from '../interfaces';

export type BambooEmployeeByIdCommand = CommandStandard<
  typeof BAMBOO_HR_COMMAND_NAME.HR_EMPLOYEE_BY_ID,
  Required<SchemaPick<PersonSchema, 'identifier'>>,
  null,
  PersonSchema,
  BambooEmployee
>;
