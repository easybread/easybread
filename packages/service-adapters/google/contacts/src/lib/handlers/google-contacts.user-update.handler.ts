import {
  type CommandHandler,
  ValidationFailedException,
} from '@easybread/core';

import { GoogleContactsUserUpdateCommand } from '../commands';
import { googleContactsContactAdapter } from '../data-adapters';
import { GoogleContactsAuthStrategy } from '../google-contacts.auth-strategy';
import { GOOGLE_CONTACTS_COMMAND_NAME } from '../google-contacts.command-name';
import { GoogleContactsFeedEntryResponse } from '../interfaces';
import { googleContactsUpdateContactTransform } from '../transform';

export const GoogleContactsUserUpdateHandler: CommandHandler<
  GoogleContactsUserUpdateCommand,
  GoogleContactsAuthStrategy
> = {
  name: GOOGLE_CONTACTS_COMMAND_NAME.BASIC_USER_UPDATE,
  async handle(input, context) {
    if (!input.params.identifier) {
      throw new ValidationFailedException(['identifier is empty']);
    }

    const personChange = input.payload;
    const entryUrl = `https://www.google.com/m8/feeds/contacts/default/full/${input.params.identifier}`;

    // https://developers.google.com/contacts/v3#updating_contacts
    //  "To update a contact, first retrieve the contact entry,
    //   modify the data and send an authorized PUT request
    //   to the contact's edit URL with the modified contact entry in the body."
    const contactBase =
      await context.httpRequest<GoogleContactsFeedEntryResponse>({
        method: 'GET',
        url: entryUrl,
        params: { alt: 'json' },
        headers: {
          'GData-Version': '3.0',
          accept: 'application/json',
        },
      });

    const contactEntryChange =
      googleContactsContactAdapter.toExternal(personChange);

    // TODO: replace this with data mapper too.
    const contactUpdatedEntry = googleContactsUpdateContactTransform(
      contactBase.data.entry,
      contactEntryChange,
    );

    const result = await context.httpRequest<GoogleContactsFeedEntryResponse>({
      method: 'PUT',
      url: entryUrl,
      data: contactUpdatedEntry,
      params: { alt: 'json' },
      headers: {
        'GData-Version': '3.0',
        'Content-Type': 'application/json',
        'If-Match': contactBase.data.entry.gd$etag,
        accept: 'application/json',
      },
    });

    return {
      success: true,
      breadId: input.breadId,
      payload: googleContactsContactAdapter.toInternal(result.data.entry),
      rawPayload: result.data,
    };
  },
};
