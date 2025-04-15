import type { CommandStandard } from '@easybread/core';
import type { PersonSchema, SchemaPick } from '@easybread/schemas';

import type { BAMBOO_HR_COMMAND_NAME } from '../bamboo-hr.command-name';

export type BambooEmployeeUpdateCommand = CommandStandard<
  typeof BAMBOO_HR_COMMAND_NAME.HR_EMPLOYEE_UPDATE,
  Required<SchemaPick<PersonSchema, 'identifier'>>,
  PersonSchema,
  PersonSchema,
  null
>;
