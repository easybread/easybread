import {
  type CommandHandler,
  ValidationFailedException,
} from '@easybread/core';

import type { GoogleContactsUserDeleteCommand } from '../commands';
import { googleContactsContactAdapter } from '../data-adapters';
import { GoogleContactsAuthStrategy } from '../google-contacts.auth-strategy';
import { GOOGLE_CONTACTS_COMMAND_NAME } from '../google-contacts.command-name';
import type { GoogleContactsFeedEntryResponse } from '../interfaces';

export const GoogleContactsUserDeleteHandler: CommandHandler<
  GoogleContactsUserDeleteCommand,
  GoogleContactsAuthStrategy
> = {
  name: GOOGLE_CONTACTS_COMMAND_NAME.BASIC_USER_DELETE,
  async handle(input, context) {
    if (!input.params.identifier) {
      throw new ValidationFailedException(['identifier is empty']);
    }

    const url = `https://www.google.com/m8/feeds/contacts/default/full/${input.params.identifier}`;

    const contactBase =
      await context.httpRequest<GoogleContactsFeedEntryResponse>({
        url,
        method: 'GET',
        params: { alt: 'json' },
        headers: {
          'GData-Version': '3.0',
          accept: 'application/json',
        },
      });

    await context.httpRequest<GoogleContactsFeedEntryResponse>({
      url,
      method: 'DELETE',
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
      payload: googleContactsContactAdapter.toInternal(contactBase.data.entry),
      rawPayload: contactBase.data,
    };
  },
};
