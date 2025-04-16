import { type CommandPaginated, PAGINATION_TYPE } from '@easybread/core';
import type { PersonSchema, SearchActionSchema } from '@easybread/schemas';

import { GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME } from '../google-admin-directory.command-name';
import type { GoogleAdminDirectoryUsersList } from '../interfaces';

export type GoogleAdminDirectoryUserSearchCommand = CommandPaginated<
  typeof PAGINATION_TYPE.CURSOR,
  typeof GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME.BASIC_USER_SEARCH,
  SearchActionSchema,
  PersonSchema[],
  GoogleAdminDirectoryUsersList
>;
