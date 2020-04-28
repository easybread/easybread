import { BreadOperationHandler, ServiceException } from '@easybread/core';
import { isString } from 'lodash';

import { GoogleAuthStrategy } from '../google.auth-strategy';
import { GOOGLE_PROVIDER } from '../google.constants';
import { GoogleOperationName } from '../google.operation-name';
import { GoogleContactsFeedEntryCreateResponse } from '../interfaces';
import { GooglePeopleUpdateOperation } from '../operations';
import {
  googleContactToPersonTransform,
  googlePersonToContactTransform,
  googleUpdateContactTransform
} from '../transform';

export const GooglePeopleUpdateHandler: BreadOperationHandler<
  GooglePeopleUpdateOperation,
  GoogleAuthStrategy
> = {
  name: GoogleOperationName.PEOPLE_UPDATE,
  async handle(input, context) {
    const personChange = input.payload;

    if (isString(personChange)) {
      throw new ServiceException(GOOGLE_PROVIDER, 'person is a string');
    }

    const entryUrl = `https://www.google.com/m8/feeds/contacts/default/full/${personChange.identifier}`;

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

    const contactEntryChange = googlePersonToContactTransform(personChange);
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
        accept: 'application/json'
      }
    });

    return {
      name: GoogleOperationName.PEOPLE_UPDATE,
      payload: googleContactToPersonTransform(result.data.entry),
      rawPayload: { success: true, data: result.data }
    };
  }
};
