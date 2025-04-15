import type { CommandStandard } from '@easybread/core';
import type { PersonSchema } from '@easybread/schemas';

import type { BAMBOO_HR_COMMAND_NAME } from '../bamboo-hr.command-name';

export type BambooEmployeeCreateCommand = CommandStandard<
  typeof BAMBOO_HR_COMMAND_NAME.HR_EMPLOYEE_CREATE,
  null,
  PersonSchema,
  PersonSchema,
  null
>;
