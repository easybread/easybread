import { type CommandStandard } from '@easybread/core';
import { PersonSchema, type SchemaPick } from '@easybread/schemas';

import type { GOOGLE_CONTACTS_COMMAND_NAME } from '../google-contacts.command-name';
import type { GoogleContactsFeedEntryResponse } from '../interfaces';

export type GoogleContactsUserDeleteCommand = CommandStandard<
  typeof GOOGLE_CONTACTS_COMMAND_NAME.BASIC_USER_DELETE,
  SchemaPick<PersonSchema, 'identifier'>,
  null,
  PersonSchema,
  GoogleContactsFeedEntryResponse
>;
