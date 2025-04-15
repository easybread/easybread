import { type CommandHandler } from '@easybread/core';

import { GoogleContactsUserCreateCommand } from '../commands';
import { googleContactsContactAdapter } from '../data-adapters';
import { GoogleContactsAuthStrategy } from '../google-contacts.auth-strategy';
import { GOOGLE_CONTACTS_COMMAND_NAME } from '../google-contacts.command-name';
import { GoogleContactsFeedEntryResponse } from '../interfaces';

export const GoogleContactsUserCreateHandler: CommandHandler<
  GoogleContactsUserCreateCommand,
  GoogleContactsAuthStrategy
> = {
  name: GOOGLE_CONTACTS_COMMAND_NAME.BASIC_USER_CREATE,
  async handle(input, context) {
    const result = await context.httpRequest<GoogleContactsFeedEntryResponse>({
      method: 'POST',
      url: `https://www.google.com/m8/feeds/contacts/default/full`,
      params: { alt: 'json' },
      headers: {
        'GData-Version': '3.0',
        accept: 'application/json',
      },
      data: googleContactsContactAdapter.toExternal(input.payload),
    });

    return {
      success: true,
      breadId: input.breadId,
      payload: googleContactsContactAdapter.toInternal(result.data.entry),
      rawPayload: result.data,
    };
  },
};
