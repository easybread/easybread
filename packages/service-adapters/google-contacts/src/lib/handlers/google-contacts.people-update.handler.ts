import {
  BreadOperationHandler,
  createSuccessfulOutputWithRawDataAndPayload,
  ServiceException
} from '@easybread/core';

import { GoogleContactsContactMapper } from '../data-mappers';
import { GoogleContactsAuthStrategy } from '../google-contacts.auth-strategy';
import { GOOGLE_PROVIDER_NAME } from '../google-contacts.constants';
import { GoogleContactsOperationName } from '../google-contacts.operation-name';
import { GoogleContactsFeedEntryResponse } from '../interfaces';
import { GoogleContactsPeopleUpdateOperation } from '../operations';
import { googleContactsUpdateContactTransform } from '../transform';

export const GoogleContactsPeopleUpdateHandler: BreadOperationHandler<
  GoogleContactsPeopleUpdateOperation,
  GoogleContactsAuthStrategy
> = {
  name: GoogleContactsOperationName.PEOPLE_UPDATE,
  async handle(input, context) {
    if (!input.payload.identifier) {
      throw new ServiceException(GOOGLE_PROVIDER_NAME, 'identifier is empty');
    }

    const personChange = input.payload;
    const entryUrl = `https://www.google.com/m8/feeds/contacts/default/full/${personChange.identifier}`;

    // https://developers.google.com/contacts/v3#updating_contacts
    //  "To update a contact, first retrieve the contact entry,
    //   modify the data and send an authorized PUT request
    //   to the contact's edit URL with the modified contact entry in the body."
    const contactBase = await context.httpRequest<
      GoogleContactsFeedEntryResponse
    >({
      method: 'GET',
      url: entryUrl,
      params: { alt: 'json' },
      headers: {
        'GData-Version': '3.0',
        accept: 'application/json'
      }
    });

    const dataMapper = new GoogleContactsContactMapper();

    const contactEntryChange = dataMapper.toRemote(personChange);

    // TODO: replace this with data mapper too.
    const contactUpdatedEntry = googleContactsUpdateContactTransform(
      contactBase.data.entry,
      contactEntryChange
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
        accept: 'application/json'
      }
    });

    return createSuccessfulOutputWithRawDataAndPayload(
      GoogleContactsOperationName.PEOPLE_UPDATE,
      result.data,
      dataMapper.toSchema(result.data.entry)
    );
  }
};
