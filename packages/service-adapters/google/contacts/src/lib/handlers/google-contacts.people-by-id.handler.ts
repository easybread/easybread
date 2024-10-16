import {
  BreadOperationHandler,
  createSuccessfulOutputWithRawDataAndPayload,
} from '@easybread/core';

import { googleContactsContactAdapter } from '../data-adapters';
import { GoogleContactsAuthStrategy } from '../google-contacts.auth-strategy';
import { GoogleContactsOperationName } from '../google-contacts.operation-name';
import { GoogleContactsFeedEntryResponse } from '../interfaces';
import { GoogleContactsPeopleByIdOperation } from '../operations';

export const GoogleContactsPeopleByIdHandler: BreadOperationHandler<
  GoogleContactsPeopleByIdOperation,
  GoogleContactsAuthStrategy
> = {
  name: GoogleContactsOperationName.PEOPLE_BY_ID,
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

    return createSuccessfulOutputWithRawDataAndPayload(
      GoogleContactsOperationName.PEOPLE_BY_ID,
      result.data,
      googleContactsContactAdapter.toInternal(result.data.entry)
    );
  },
};
