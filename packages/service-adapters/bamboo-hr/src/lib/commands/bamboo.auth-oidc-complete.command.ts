import type { CommandStandard } from '@easybread/core';
import type { AuthCompleteOidcRequestSchema } from '@easybread/schemas';

import { BAMBOO_HR_COMMAND_NAME } from '../bamboo-hr.command-name';

export type BambooAuthOidcCompleteCommand = CommandStandard<
  typeof BAMBOO_HR_COMMAND_NAME.AUTH_OIDC_COMPLETE,
  null,
  AuthCompleteOidcRequestSchema,
  null,
  { companyName: string }
>;
