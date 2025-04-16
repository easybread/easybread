import { type CommandStandard } from '@easybread/core';
import { PersonSchema, type SchemaPick } from '@easybread/schemas';

import { GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME } from '../google-admin-directory.command-name';
import { GoogleAdminDirectoryUser } from '../interfaces';

export type GoogleAdminDirectoryUserUpdateCommand = CommandStandard<
  typeof GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME.BASIC_USER_UPDATE,
  SchemaPick<PersonSchema, 'identifier'>,
  PersonSchema,
  PersonSchema,
  GoogleAdminDirectoryUser
>;
