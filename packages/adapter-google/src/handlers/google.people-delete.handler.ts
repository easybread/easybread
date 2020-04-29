import {
  BreadOperationHandler,
  ServiceException,
  ServiceStringThingException
} from '@easybread/core';
import { isString } from 'lodash';

import { GoogleAuthStrategy } from '../google.auth-strategy';
import { GOOGLE_PROVIDER } from '../google.constants';
import { GoogleOperationName } from '../google.operation-name';
import { GoogleContactsFeedEntryCreateResponse } from '../interfaces';
import { GooglePeopleDeleteOperation } from '../operations';

export const GooglePeopleDeleteHandler: BreadOperationHandler<
  GooglePeopleDeleteOperation,
  GoogleAuthStrategy
> = {
  name: GoogleOperationName.PEOPLE_DELETE,
  async handle(input, context) {
    if (isString(input.payload)) {
      throw new ServiceStringThingException(GOOGLE_PROVIDER, 'Person');
    }

    if (!input.payload.identifier) {
      throw new ServiceException(GOOGLE_PROVIDER, 'identifier is empty');
    }

    const url = `https://www.google.com/m8/feeds/contacts/default/full/${input.payload.identifier}`;

    const contactBase = await context.httpRequest<
      GoogleContactsFeedEntryCreateResponse
    >({
      url,
      method: 'GET',
      params: { alt: 'json' },
      headers: {
        'GData-Version': '3.0',
        accept: 'application/json'
      }
    });

    await context.httpRequest<GoogleContactsFeedEntryCreateResponse>({
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

    return {
      name: GoogleOperationName.PEOPLE_DELETE,
      payload: input.payload,
      rawPayload: { success: true }
    };
  }
};
