import type { CommandStandard } from '@easybread/core';
import type { PersonSchema, SchemaPick } from '@easybread/schemas';

import { GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME } from '../google-admin-directory.command-name';
import type { GoogleAdminDirectoryUser } from '../interfaces';

export type GoogleAdminDirectoryUserByIdCommand = CommandStandard<
  typeof GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME.BASIC_USER_BY_ID,
  SchemaPick<PersonSchema, 'identifier'>,
  null,
  PersonSchema,
  GoogleAdminDirectoryUser
>;
