import { BreadOperationHandler } from '@easybread/core';

import { GoogleAuthStrategy } from '../google.auth-strategy';
import { GoogleOperationName } from '../google.operation-name';
import { GoogleContactsFeedEntryCreateResponse } from '../interfaces';
import { GooglePeopleCreateOperation } from '../operations';
import {
  googleContactToPersonTransform,
  googlePersonToContactTransform
} from '../transform';

export const GooglePeopleCreateHandler: BreadOperationHandler<
  GooglePeopleCreateOperation,
  GoogleAuthStrategy
> = {
  name: GoogleOperationName.PEOPLE_CREATE,
  async handle(input, context) {
    const contact = googlePersonToContactTransform(input.payload);
    const result = await context.httpRequest<
      GoogleContactsFeedEntryCreateResponse
    >({
      method: 'POST',
      url: `https://www.google.com/m8/feeds/contacts/default/full`,
      params: { alt: 'json' },
      headers: {
        'GData-Version': '3.0',
        accept: 'application/json'
      },
      data: contact
    });

    return {
      name: GoogleOperationName.PEOPLE_CREATE,
      payload: googleContactToPersonTransform(result.data.entry),
      rawPayload: { success: true, data: result.data }
    };
  }
};
