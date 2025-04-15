import { type CommandStandard } from '@easybread/core';
import { PersonSchema, type SchemaPick } from '@easybread/schemas';

import { GOOGLE_CONTACTS_COMMAND_NAME } from '../google-contacts.command-name';
import { GoogleContactsFeedEntryResponse } from '../interfaces';

export type GoogleContactsUserByIdCommand = CommandStandard<
  typeof GOOGLE_CONTACTS_COMMAND_NAME.BASIC_USER_BY_ID,
  SchemaPick<PersonSchema, 'identifier'>,
  null,
  PersonSchema,
  GoogleContactsFeedEntryResponse
>;
