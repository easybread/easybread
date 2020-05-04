import { BreadOperationHandler, ServiceException } from '@easybread/core';

import { GoogleContactMapper } from '../data-mappers';
import { GoogleAuthStrategy } from '../google.auth-strategy';
import { GOOGLE_PROVIDER_NAME } from '../google.constants';
import { GoogleOperationName } from '../google.operation-name';
import { GoogleContactsFeedEntryCreateResponse } from '../interfaces';
import { GooglePeopleUpdateOperation } from '../operations';
import { googleUpdateContactTransform } from '../transform';

export const GooglePeopleUpdateHandler: BreadOperationHandler<
  GooglePeopleUpdateOperation,
  GoogleAuthStrategy
> = {
  name: GoogleOperationName.PEOPLE_UPDATE,
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
      GoogleContactsFeedEntryCreateResponse
    >({
      method: 'GET',
      url: entryUrl,
      params: { alt: 'json' },
      headers: {
        'GData-Version': '3.0',
        accept: 'application/json'
      }
    });

    const dataMapper = new GoogleContactMapper();

    const contactEntryChange = dataMapper.toRemote(personChange);

    // TODO: replace this with data mapper too.
    const contactUpdatedEntry = googleUpdateContactTransform(
      contactBase.data.entry,
      contactEntryChange
    );

    const result = await context.httpRequest<
      GoogleContactsFeedEntryCreateResponse
    >({
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

    return {
      name: GoogleOperationName.PEOPLE_UPDATE,
      payload: dataMapper.toSchema(result.data.entry),
      rawPayload: { success: true, data: result.data }
    };
  }
};
