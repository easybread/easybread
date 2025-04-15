import { type CommandHandler } from '@easybread/core';

import { GoogleContactsUserByIdCommand } from '../commands';
import { googleContactsContactAdapter } from '../data-adapters';
import { GoogleContactsAuthStrategy } from '../google-contacts.auth-strategy';
import { GOOGLE_CONTACTS_COMMAND_NAME } from '../google-contacts.command-name';
import { GoogleContactsFeedEntryResponse } from '../interfaces';

export const GoogleContactsUserByIdHandler: CommandHandler<
  GoogleContactsUserByIdCommand,
  GoogleContactsAuthStrategy
> = {
  name: GOOGLE_CONTACTS_COMMAND_NAME.BASIC_USER_BY_ID,
  async handle(input, context) {
    const { identifier } = input.params;

    const result = await context.httpRequest<GoogleContactsFeedEntryResponse>({
      method: 'GET',
      url: `https://www.google.com/m8/feeds/contacts/default/full/${identifier}`,
      params: { alt: 'json' },
      headers: {
        'GData-Version': '3.0',
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
