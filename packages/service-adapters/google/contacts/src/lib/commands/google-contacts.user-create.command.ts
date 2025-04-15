import { type CommandStandard } from '@easybread/core';
import type { PersonSchema } from '@easybread/schemas';

import { GOOGLE_CONTACTS_COMMAND_NAME } from '../google-contacts.command-name';
import type { GoogleContactsFeedEntryResponse } from '../interfaces';

export type GoogleContactsUserCreateCommand = CommandStandard<
  typeof GOOGLE_CONTACTS_COMMAND_NAME.BASIC_USER_CREATE,
  null,
  PersonSchema,
  PersonSchema,
  GoogleContactsFeedEntryResponse
>;
