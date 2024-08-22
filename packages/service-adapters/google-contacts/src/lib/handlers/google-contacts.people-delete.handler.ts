import {
  BreadOperationHandler,
  createSuccessfulOutputWithPayload,
  ServiceException
} from '@easybread/core';

import { GoogleContactsAuthStrategy } from '../google-contacts.auth-strategy';
import { GOOGLE_PROVIDER_NAME } from '../google-contacts.constants';
import { GoogleContactsOperationName } from '../google-contacts.operation-name';
import { GoogleContactsFeedEntryResponse } from '../interfaces';
import { GoogleContactsPeopleDeleteOperation } from '../operations';

export const GoogleContactsPeopleDeleteHandler: BreadOperationHandler<
  GoogleContactsPeopleDeleteOperation,
  GoogleContactsAuthStrategy
> = {
  name: GoogleContactsOperationName.PEOPLE_DELETE,
  async handle(input, context) {
    if (!input.payload.identifier) {
      throw new ServiceException(GOOGLE_PROVIDER_NAME, 'identifier is empty');
    }

    const url = `https://www.google.com/m8/feeds/contacts/default/full/${input.payload.identifier}`;

    const contactBase = await context.httpRequest<
      GoogleContactsFeedEntryResponse
    >({
      url,
      method: 'GET',
      params: { alt: 'json' },
      headers: {
        'GData-Version': '3.0',
        accept: 'application/json'
      }
    });

    await context.httpRequest<GoogleContactsFeedEntryResponse>({
      url,
      method: 'DELETE',
      params: { alt: 'json' },
      headers: {
        'GData-Version': '3.0',
        'Content-Type': 'application/json',
        'If-Match': contactBase.data.entry.gd$etag,
        accept: 'application/json'
      }
    });

    return createSuccessfulOutputWithPayload(
      GoogleContactsOperationName.PEOPLE_DELETE,
      input.payload
    );
  }
};
