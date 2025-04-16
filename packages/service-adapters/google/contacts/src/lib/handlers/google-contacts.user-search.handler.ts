import { type CommandHandler } from '@easybread/core';

import { GoogleContactsUserSearchCommand } from '../commands';
import {
  googleContactsContactAdapter,
  googleContactsPaginationAdapter,
} from '../data-adapters';
import { GoogleContactsAuthStrategy } from '../google-contacts.auth-strategy';
import { GOOGLE_CONTACTS_COMMAND_NAME } from '../google-contacts.command-name';
import { GoogleContactsFeedResponse } from '../interfaces';

export const GoogleContactsUserSearchHandler: CommandHandler<
  GoogleContactsUserSearchCommand,
  GoogleContactsAuthStrategy
> = {
  name: GOOGLE_CONTACTS_COMMAND_NAME.BASIC_USER_SEARCH,

  async handle(input, context) {
    const { query = '' } = input.params;

    const remotePaginationParams = input.pagination
      ? googleContactsPaginationAdapter.toExternalParams(input.pagination)
      : {};

    const result = await context.httpRequest<GoogleContactsFeedResponse>({
      method: 'GET',
      url: `https://www.google.com/m8/feeds/contacts/default/full`,
      params: {
        alt: 'json',
        q: query,
        ...remotePaginationParams,
      },
      headers: {
        'GData-Version': '3.0',
        accept: 'application/json',
      },
    });

    return {
      success: true,
      breadId: input.breadId,
      pagination: googleContactsPaginationAdapter.toInternalData(result.data),
      payload: result.data.feed.entry.map(
        googleContactsContactAdapter.toInternal,
      ),
      rawPayload: result.data,
    };
  },
};
