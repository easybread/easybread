import {
  BreadOperationHandler,
  createSuccessfulCollectionOutputWithRawDataAndPayload,
} from '@easybread/core';

import {
  googleContactsContactAdapter,
  googleContactsPaginationAdapter,
} from '../data-adapters';
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

    return createSuccessfulCollectionOutputWithRawDataAndPayload(
      GoogleContactsOperationName.PEOPLE_SEARCH,
      result.data,
      result.data.feed.entry.map(googleContactsContactAdapter.toInternal),
      googleContactsPaginationAdapter.toInternalData(result.data)
    );
  },
};
