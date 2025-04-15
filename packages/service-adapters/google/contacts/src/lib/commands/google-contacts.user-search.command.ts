import { type CommandPaginated, PAGINATION_TYPE } from '@easybread/core';
import type { PersonSchema, SearchActionSchema } from '@easybread/schemas';

import type { GOOGLE_CONTACTS_COMMAND_NAME } from '../google-contacts.command-name';
import type { GoogleContactsFeedResponse } from '../interfaces';

export type GoogleContactsUserSearchCommand = CommandPaginated<
  typeof PAGINATION_TYPE.OFFSET,
  typeof GOOGLE_CONTACTS_COMMAND_NAME.BASIC_USER_SEARCH,
  SearchActionSchema,
  PersonSchema[],
  GoogleContactsFeedResponse
>;
