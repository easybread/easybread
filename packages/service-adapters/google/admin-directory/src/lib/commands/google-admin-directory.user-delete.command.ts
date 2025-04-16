import type { CommandStandard } from '@easybread/core';
import type { PersonSchema, SchemaPick } from '@easybread/schemas';

import { GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME } from '../google-admin-directory.command-name';

export type GoogleAdminDirectoryUserDeleteCommand = CommandStandard<
  typeof GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME.BASIC_USER_DELETE,
  SchemaPick<PersonSchema, 'identifier'>,
  null,
  null,
  null
>;
