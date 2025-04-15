import type { CommandStandard } from '@easybread/core';
import type { AuthCredentialBasicSchema } from '@easybread/schemas';

import type { BAMBOO_HR_COMMAND_NAME } from '../bamboo-hr.command-name';

export type BambooAuthBasicSetCommand = CommandStandard<
  typeof BAMBOO_HR_COMMAND_NAME.AUTH_BASIC_SET,
  null,
  AuthCredentialBasicSchema,
  null,
  null
>;
