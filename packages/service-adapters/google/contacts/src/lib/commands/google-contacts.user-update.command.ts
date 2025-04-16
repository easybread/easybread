import type { CommandStandard } from '@easybread/core';
import type { PersonSchema, SchemaPick } from '@easybread/schemas';

import type { GOOGLE_CONTACTS_COMMAND_NAME } from '../google-contacts.command-name';
import type { GoogleContactsFeedEntryResponse } from '../interfaces';

export type GoogleContactsUserUpdateCommand = CommandStandard<
  typeof GOOGLE_CONTACTS_COMMAND_NAME.BASIC_USER_UPDATE,
  SchemaPick<PersonSchema, 'identifier'>,
  PersonSchema,
  PersonSchema,
  GoogleContactsFeedEntryResponse
>;
