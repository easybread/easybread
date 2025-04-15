import type { CommandStandard } from '@easybread/core';
import type { PersonSchema } from '@easybread/schemas';

import { GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME } from '../google-admin-directory.command-name';
import type { GoogleAdminDirectoryUser } from '../interfaces';

export type GoogleAdminDirectoryUserCreateCommand = CommandStandard<
  typeof GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME.BASIC_USER_CREATE,
  null,
  PersonSchema,
  PersonSchema,
  GoogleAdminDirectoryUser
>;
