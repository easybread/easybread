import { BreadOperationHandler } from '@easybread/core';

import { GoogleContactMapper } from '../data-mappers';
import { GoogleAuthStrategy } from '../google.auth-strategy';
import { GoogleOperationName } from '../google.operation-name';
import { GoogleContactsFeedResponse } from '../interfaces';
import { GooglePeopleSearchOperation } from '../operations';

export const GooglePeopleSearchHandler: BreadOperationHandler<
  GooglePeopleSearchOperation,
  GoogleAuthStrategy
> = {
  name: GoogleOperationName.PEOPLE_SEARCH,

  async handle(input, context) {
    const { query = '' } = input.params;

    const contactMapper = new GoogleContactMapper();

    const result = await context.httpRequest<GoogleContactsFeedResponse>({
      method: 'GET',
      url: `https://www.google.com/m8/feeds/contacts/default/full`,
      params: { alt: 'json', maxResults: 20, q: query },
      headers: {
        'GData-Version': '3.0',
        accept: 'application/json'
      }
    });

    return {
      name: GoogleOperationName.PEOPLE_SEARCH,
      payload: result.data.feed.entry.map(entry =>
        contactMapper.toSchema(entry)
      ),
      rawPayload: { success: true, data: result.data }
    };
  }
};
