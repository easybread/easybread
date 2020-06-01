import {
  BreadOperationHandler,
  createSuccessfulCollectionOutputWithRawDataAndPayload
} from '@easybread/core';

import { GoogleContactsContactMapper } from '../data-mappers';
import { GoogleContactsAuthStrategy } from '../google-contacts.auth-strategy';
import { GoogleContactsOperationName } from '../google-contacts.operation-name';
import { GoogleContactsFeedResponse } from '../interfaces';
import { GoogleContactsPeopleSearchOperation } from '../operations';

export const GoogleContactsPeopleSearchHandler: BreadOperationHandler<
  GoogleContactsPeopleSearchOperation,
  GoogleContactsAuthStrategy
> = {
  name: GoogleContactsOperationName.PEOPLE_SEARCH,

  async handle(input, context) {
    const { query = '' } = input.params;

    const result = await context.httpRequest<GoogleContactsFeedResponse>({
      method: 'GET',
      url: `https://www.google.com/m8/feeds/contacts/default/full`,
      params: { alt: 'json', maxResults: 20, q: query },
      headers: {
        'GData-Version': '3.0',
        accept: 'application/json'
      }
    });

    const contactMapper = new GoogleContactsContactMapper();

    return createSuccessfulCollectionOutputWithRawDataAndPayload(
      GoogleContactsOperationName.PEOPLE_SEARCH,
      result.data,
      result.data.feed.entry.map(entry => contactMapper.toSchema(entry))
    );
  }
};
