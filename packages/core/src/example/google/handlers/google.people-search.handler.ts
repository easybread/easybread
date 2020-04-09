import { BreadOperationHandler } from '../../../operation';
import { GoogleAuthStrategy } from '../google.auth-strategy';
import { GoogleOperationName } from '../google.operation-name';
import { GoogleContactsFeedResponse } from '../interfaces';
import { GooglePeopleSearchOperation } from '../operations';
import { googleContactToPersonTransform } from '../transform';

export const GooglePeopleSearchHandler: BreadOperationHandler<
  GooglePeopleSearchOperation,
  GoogleAuthStrategy
> = {
  name: GoogleOperationName.PEOPLE_SEARCH,

  async handle(_input, context) {
    const result = await context.httpRequest<GoogleContactsFeedResponse>({
      method: 'GET',
      url: `https://www.google.com/m8/feeds/contacts/default/full`,
      params: { alt: 'json' },
      headers: {
        'GData-Version': '3.0',
        accept: 'application/json'
      }
    });

    return {
      name: GoogleOperationName.PEOPLE_SEARCH,
      payload: result.data.feed.entry.map(googleContactToPersonTransform),
      rawPayload: { success: true, data: result.data }
    };
  }
};
